import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'
import { createLog } from '@/app/lib/utils/logHelper'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

export async function POST(req: NextRequest) {
  const { email, newPlan, prorationBehavior = 'create_prorations' } = await req.json()

  // Input validation
  if (!email || !newPlan) {
    return NextResponse.json(
      {
        message: 'Email and newPlan are required',
        sliceName: sliceAuth
      },
      { status: 400 }
    )
  }

  // Validate plan type
  if (!['BASIC', 'PREMIUM'].includes(newPlan)) {
    return NextResponse.json(
      {
        message: 'Invalid plan. Must be BASIC or PREMIUM',
        sliceName: sliceAuth
      },
      { status: 400 }
    )
  }

  // Get price ID from environment
  const newPriceId =
    newPlan === 'BASIC' ? process.env.STRIPE_BASIC_MONTHLY_PRODUCT_ID : process.env.STRIPE_PREMIUM_MONTHLY_PRODUCT_ID

  if (!newPriceId) {
    return NextResponse.json(
      { message: `Price ID not found for ${newPlan} plan`, sliceName: sliceAuth },
      { status: 404 }
    )
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      await createLog('warning', 'User not found during subscription update', {
        location: ['stripe route - POST /api/stripe/update-subscription'],
        name: 'UserNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })
      return NextResponse.json({ message: 'User not found', sliceName: sliceAuth }, { status: 404 })
    }

    // Find active subscription
    const activeSubscription = await prisma.stripeSubscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['active', 'trialing'] }
      }
    })

    if (!activeSubscription || !activeSubscription.subscriptionId) {
      return NextResponse.json(
        {
          message: 'No active subscription found',
          sliceName: sliceAuth
        },
        { status: 404 }
      )
    }

    // Check if they're trying to "upgrade" to the same plan
    const currentPlan = getCurrentPlanName(activeSubscription.plan)
    if (currentPlan === newPlan) {
      return NextResponse.json(
        {
          message: `Already subscribed to ${newPlan} plan`,
          sliceName: sliceAuth
        },
        { status: 400 }
      )
    }

    // Get current subscription from Stripe to get the subscription item ID
    const stripeSubscription = (await stripe.subscriptions.retrieve(
      activeSubscription.subscriptionId
    )) as Stripe.Subscription

    if (!stripeSubscription.items.data[0]) {
      throw new Error('No subscription items found')
    }

    const subscriptionItemId = stripeSubscription.items.data[0].id

    // Update the subscription in Stripe
    const updatedSubscription = (await stripe.subscriptions.update(activeSubscription.subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId
        }
      ],
      proration_behavior: prorationBehavior
    })) as Stripe.Subscription

    // Determine if this is an upgrade or downgrade
    const planChange = determinePlanChange(currentPlan, newPlan)

    // Update subscription in database
    await prisma.stripeSubscription.update({
      where: { id: activeSubscription.id },
      data: {
        plan: newPriceId,
        status: updatedSubscription.status,
        currentPeriodEnd: new Date((updatedSubscription as any).current_period_end * 1000)
      }
    })

    await createLog('info', `Subscription ${planChange.type}: ${planChange.from} → ${planChange.to}`, {
      location: ['stripe route - POST /api/stripe/update-subscription'],
      name: 'SubscriptionUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email,
      subscriptionId: activeSubscription.subscriptionId,
      oldPlan: activeSubscription.plan,
      newPlan: newPriceId,
      changeType: planChange.type
    })

    return NextResponse.json(
      {
        message: `Successfully ${planChange.type.toLowerCase()}d to ${planChange.to}`,
        subscriptionId: activeSubscription.subscriptionId,
        oldPlan: planChange.from,
        newPlan: planChange.to,
        changeType: planChange.type,
        prorationAmount: calculateProrationInfo(updatedSubscription)
      },
      { status: 200 }
    )
  } catch (error: any) {
    await createLog('error', `Subscription update failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email,
      stripeErrorCode: error.code || null,
      stripeErrorType: error.type || null
    })

    return NextResponse.json(
      {
        message: 'Subscription update failed',
        error: error.message,
        sliceName: sliceAuth
      },
      { status: 500 }
    )
  }
}

// Helper function to get plan name from price ID
function getCurrentPlanName(priceId: string) {
  const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID
  const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID

  if (priceId === basicPriceId) return 'BASIC'
  if (priceId === premiumPriceId) return 'PREMIUM'
  return 'UNKNOWN'
}

// Helper function to determine plan change type
function determinePlanChange(oldPlan: string, newPlan: string) {
  const isUpgrade = oldPlan === 'BASIC' && newPlan === 'PREMIUM'
  const isDowngrade = oldPlan === 'PREMIUM' && newPlan === 'BASIC'

  return {
    type: isUpgrade ? 'UPGRADE' : isDowngrade ? 'DOWNGRADE' : 'CHANGE',
    from: oldPlan,
    to: newPlan
  }
}

// Helper function to extract proration info
function calculateProrationInfo(subscription: Stripe.Subscription) {
  const latestInvoice = subscription.latest_invoice as any
  if (latestInvoice && latestInvoice.lines) {
    const prorationLines = latestInvoice.lines.data.filter((line: any) => line.proration)
    return prorationLines.length > 0 ? 'Prorated charges applied' : 'No proration'
  }
  return 'Proration info unavailable'
}
