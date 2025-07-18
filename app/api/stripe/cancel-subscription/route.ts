import { createLog } from '@/app/lib/api/createLog'
import prisma from '@/prisma/client'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Get user's subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { stripeSubscription: true }
    })

    if (!user || !user.stripeSubscription?.subscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const subscriptionId = user.stripeSubscription.subscriptionId

    // Cancel at period end - user keeps access until billing period ends
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })

    // Update database
    await prisma.stripeSubscription.update({
      where: { id: user.stripeSubscription.id },
      data: {
        cancelAtPeriodEnd: true
      }
    })

    const periodEnd = new Date((canceledSubscription as any).current_period_end * 1000)

    return NextResponse.json({
      success: true,
      message: `Subscription canceled. Access until ${periodEnd.toLocaleDateString()}`,
      accessUntil: periodEnd
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
      stripeErrorType: error.type || null
    })
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
