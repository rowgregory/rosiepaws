import { createLog } from '@/app/lib/api/createLog'
import { createStripeInstance } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

const stripe = createStripeInstance()

export async function POST(req: NextRequest) {
  let userId
  try {
    const body = await req.json()
    userId = body.userId

    // Get user's subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { stripeSubscription: true }
    })

    if (!user || !user.stripeSubscription?.subscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const subscriptionId = user.stripeSubscription.subscriptionId

    // Check if already scheduled for cancellation
    if (user.stripeSubscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        {
          error: 'Subscription is already scheduled for cancellation',
          accessUntil: user.stripeSubscription.currentPeriodEnd
        },
        { status: 400 }
      )
    }

    // Cancel at period end - user keeps access until billing period ends
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })

    const rawPeriodEnd = (canceledSubscription as any).current_period_end
    const periodEnd = rawPeriodEnd
      ? new Date(rawPeriodEnd * 1000)
      : new Date(user.stripeSubscription.currentPeriodEnd || Date.now() + 30 * 24 * 60 * 60 * 1000)

    await createLog('info', 'Subscription cancellation scheduled', {
      location: ['api - POST /api/stripe/cancel-subscription'],
      name: 'SubscriptionCancellationScheduled',
      timestamp: new Date().toISOString(),
      userId: userId,
      subscriptionId: subscriptionId,
      accessUntil: periodEnd.toISOString(),
      userEmail: user.email
    })

    return NextResponse.json({
      success: true,
      message: `Subscription canceled. Access until ${periodEnd.toLocaleDateString()}`,
      accessUntil: periodEnd,
      url: '/guardian/home'
    })
  } catch (error: any) {
    await createLog('error', `Subscription cancellation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      stripeErrorCode: error.code || null,
      stripeErrorType: error.type || null,
      userId
    })
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
