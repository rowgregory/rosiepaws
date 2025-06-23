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
  const { email, cancelAtPeriodEnd = true } = await req.json()

  // Input validation
  if (!email) {
    return NextResponse.json(
      {
        message: 'Email is required',
        sliceName: sliceAuth
      },
      { status: 400 }
    )
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      await createLog('warning', 'User not found during subscription cancellation', {
        location: ['stripe route - POST /api/stripe/cancel-subscription'],
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
        status: { in: ['active', 'trialing', 'past_due'] }
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

    // Cancel subscription in Stripe
    const canceledSubscription = (await stripe.subscriptions.update(activeSubscription.subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd
    })) as any

    // If immediate cancellation, also set cancellation date
    if (!cancelAtPeriodEnd) {
      await stripe.subscriptions.cancel(activeSubscription.subscriptionId!)
    }

    // Update subscription in database
    await prisma.stripeSubscription.update({
      where: { id: activeSubscription.id },
      data: {
        status: cancelAtPeriodEnd ? 'active' : 'canceled',
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        canceledAt: cancelAtPeriodEnd ? null : new Date(),
        currentPeriodEnd: new Date((canceledSubscription as any).current_period_end * 1000)
      }
    })

    await createLog(
      'info',
      `Subscription ${cancelAtPeriodEnd ? 'scheduled for cancellation' : 'canceled immediately'}`,
      {
        location: ['stripe route - POST /api/stripe/cancel-subscription'],
        name: 'SubscriptionCanceled',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email,
        subscriptionId: activeSubscription.subscriptionId,
        cancelAtPeriodEnd
      }
    )

    return NextResponse.json(
      {
        message: cancelAtPeriodEnd
          ? 'Subscription will be canceled at the end of the current billing period'
          : 'Subscription canceled immediately',
        subscriptionId: activeSubscription.subscriptionId,
        cancelAtPeriodEnd,
        periodEndDate: canceledSubscription.current_period_end
          ? new Date((canceledSubscription as any).current_period_end * 1000).toISOString()
          : null
      },
      { status: 200 }
    )
  } catch (error: any) {
    await createLog('error', `Subscription cancellation failed: ${error.message}`, {
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
        message: 'Subscription cancellation failed',
        error: error.message,
        sliceName: sliceAuth
      },
      { status: 500 }
    )
  }
}
