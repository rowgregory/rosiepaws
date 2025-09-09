import { createLog } from '@/app/lib/api/createLog'
import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id

  try {
    // Find the subscription in database
    const stripeSubscription = await prisma.stripeSubscription.findFirst({
      where: { subscriptionId: subscriptionId },
      include: {
        user: {
          select: { id: true, email: true, tokens: true, role: true }
        }
      }
    })

    if (!stripeSubscription) {
      await createLog('error', 'Subscription deleted but no subscription record found', {
        location: ['webhook - customer.subscription.deleted'],
        name: 'SubscriptionDeletedNoRecord',
        timestamp: new Date().toISOString(),
        customerId: customerId,
        subscriptionId: subscriptionId
      })
      return
    }

    // Update subscription status to canceled
    await prisma.stripeSubscription.update({
      where: { id: stripeSubscription.id },
      data: {
        status: 'canceled',
        plan: 'FREE',
        planPrice: 0,
        tokensIncluded: 0,
        canceledAt: new Date(),
        cancelAtPeriodEnd: false, // Reset this flag
        subscriptionId: null // Clear the subscription ID since it's deleted
      }
    })

    // Downgrade user to free tier but KEEP their tokens
    await prisma.user.update({
      where: { id: stripeSubscription.userId },
      data: {
        isFreeUser: true,
        isComfortUser: false,
        isLegacyUser: false,
        role: 'FREE'
        // NOTE: We intentionally do NOT reset tokens - user keeps them
      }
    })

    // Log successful downgrade
    await createLog('info', 'User downgraded to free due to subscription deletion - tokens preserved', {
      location: ['webhook - customer.subscription.deleted'],
      name: 'UserDowngradedToFreeOnDeletion',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      userId: stripeSubscription.userId,
      userEmail: stripeSubscription.user.email,
      previousPlan: stripeSubscription.plan,
      tokensPreserved: true,
      currentTokens: stripeSubscription.user.tokens,
      reason: 'Subscription deleted'
    })
  } catch (error) {
    await createLog('error', 'Error handling subscription deletion', {
      location: ['webhook - customer.subscription.deleted'],
      name: 'SubscriptionDeletionError',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })

    // Re-throw so webhook returns 500 and Stripe retries
    throw error
  }
}

export default handleCustomerSubscriptionDeleted
