import { createLog } from '@/app/lib/api/createLog'
import determineNotificationType from '@/app/lib/api/stripe/determineNotificationType'
import sendPusherNotification from '@/app/lib/api/stripe/sendPusherNotification'
import { createStripeInstance, getStripeProductIds } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import Stripe from 'stripe'

interface PlanConfig {
  plan: string
  tokensToAdd: number
  planPrice: number
  userRole: string
  isComfortUser: boolean
  isLegacyUser: boolean
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  COMFORT: {
    plan: 'COMFORT',
    tokensToAdd: 12000,
    planPrice: 1000, // $10.00 in cents
    userRole: 'COMFORT',
    isComfortUser: true,
    isLegacyUser: false
  },
  LEGACY: {
    plan: 'LEGACY',
    tokensToAdd: 0, // unlimited
    planPrice: 2500, // $25.00 in cents
    userRole: 'LEGACY',
    isComfortUser: false,
    isLegacyUser: true
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const sessionId = session.id
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.client_reference_id

  try {
    // Validate required data
    if (!userId) {
      await createLog('error', 'Checkout completed but no user ID found in client_reference_id', {
        location: ['webhook - checkout.session.completed'],
        name: 'CheckoutCompletedNoUserId',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        customerId: customerId,
        subscriptionId: subscriptionId
      })
      return
    }

    if (!subscriptionId) {
      await createLog('error', 'Checkout completed but no subscription ID found', {
        location: ['webhook - checkout.session.completed'],
        name: 'CheckoutCompletedNoSubscriptionId',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        customerId: customerId,
        userId: userId
      })
      return
    }

    // Check if we already processed this session
    const existingSubscription = await prisma.stripeSubscription.findFirst({
      where: { subscriptionId: subscriptionId },
      include: {
        user: {
          select: { email: true, tokens: true }
        }
      }
    })

    if (existingSubscription) {
      await createLog('info', 'Checkout session already processed, skipping', {
        location: ['webhook - checkout.session.completed'],
        name: 'CheckoutSessionAlreadyProcessed',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        subscriptionId: subscriptionId,
        userId: userId
      })
      return
    }

    const stripe = createStripeInstance()

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id

    if (!priceId) {
      throw new Error('No price ID found in subscription items')
    }

    // Get environment-appropriate price IDs
    const stripeProducts = getStripeProductIds()

    // Determine plan based on price ID
    let planConfig: PlanConfig | null = null

    if (priceId === stripeProducts.comfort.priceId) {
      planConfig = PLAN_CONFIGS.COMFORT
    } else if (priceId === stripeProducts.legacy.priceId) {
      planConfig = PLAN_CONFIGS.LEGACY
    } else {
      await createLog('error', 'Unknown price ID in checkout session', {
        location: ['webhook - checkout.session.completed'],
        name: 'CheckoutUnknownPriceId',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        subscriptionId: subscriptionId,
        priceId: priceId,
        userId: userId,
        availablePrices: {
          comfort: stripeProducts.comfort.priceId,
          legacy: stripeProducts.legacy.priceId
        }
      })
      return
    }

    const currentPeriodEnd = (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Get user info for logging
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, tokens: true, role: true }
    })

    if (!user) {
      throw new Error(`User not found with ID: ${userId}`)
    }

    // Update or create the subscription record
    await prisma.stripeSubscription.upsert({
      where: { userId: userId },
      create: {
        userId: userId,
        customerId: customerId,
        subscriptionId: subscriptionId,
        paymentMethodId: session.payment_method_types?.[0] || '',
        status: subscription.status,
        plan: planConfig.plan,
        planPrice: planConfig.planPrice,
        tokensIncluded: planConfig.tokensToAdd,
        currentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
      },
      update: {
        subscriptionId: subscriptionId,
        customerId: customerId,
        status: subscription.status,
        plan: planConfig.plan,
        planPrice: planConfig.planPrice,
        tokensIncluded: planConfig.tokensToAdd,
        currentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
      }
    })

    // Update user role and add tokens
    const userUpdateData: any = {
      stripeCustomerId: customerId, // Add this critical line!
      isFreeUser: false,
      isComfortUser: planConfig.isComfortUser,
      isLegacyUser: planConfig.isLegacyUser,
      role: planConfig.userRole
    }

    // Only add tokens for Comfort users (Legacy is unlimited)
    if (planConfig.plan === 'COMFORT' && planConfig.tokensToAdd > 0) {
      userUpdateData.tokens = { increment: planConfig.tokensToAdd }
    }

    await prisma.user.update({
      where: { id: userId },
      data: userUpdateData
    })

    const wasInCancelledState = subscription.cancel_at_period_end === true

    const notificationType = determineNotificationType(
      subscription,
      planConfig.plan,
      subscription.cancel_at_period_end,
      wasInCancelledState
    )

    await sendPusherNotification(userId, {
      success: true,
      planName: planConfig.plan,
      type: notificationType,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
      timestamp: new Date().toISOString()
    })

    // Log successful checkout completion
    await createLog('info', 'Checkout session processed successfully', {
      location: ['webhook - checkout.session.completed'],
      name: 'CheckoutSessionCompleted',
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      customerId: customerId,
      subscriptionId: subscriptionId,
      userId: userId,
      userEmail: user.email,
      previousRole: user.role,
      newPlan: planConfig.plan,
      planPrice: planConfig.planPrice,
      tokensAdded: planConfig.plan === 'COMFORT' ? planConfig.tokensToAdd : 0,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
      previousTokens: user.tokens,
      newTokens: user.tokens + (planConfig.plan === 'COMFORT' ? planConfig.tokensToAdd : 0)
    })
  } catch (error) {
    await createLog('error', 'Error handling checkout completion', {
      location: ['webhook - checkout.session.completed'],
      name: 'CheckoutCompletionError',
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      customerId: customerId,
      subscriptionId: subscriptionId,
      userId: userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })

    // Re-throw so webhook returns 500 and Stripe retries
    throw error
  }
}

export default handleCheckoutCompleted
