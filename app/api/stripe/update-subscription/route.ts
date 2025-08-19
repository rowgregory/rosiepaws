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
    const { userId, newPlanId } = await req.json()

    // Define your subscription plans (match your current structure)
    const plans: Record<string, { priceId: string; name: string; userRole: string }> = {
      comfort: { priceId: process.env.STRIPE_COMFORT_MONTHLY_PRICE_ID!, name: 'COMFORT', userRole: 'comfort_user' },
      legacy: { priceId: process.env.STRIPE_LEGACY_MONTHLY_PRICE_ID!, name: 'LEGACY', userRole: 'legacy_user' }
    }

    if (!plans[newPlanId]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Get user's current subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { stripeSubscription: true }
    })

    if (!user || !user.stripeSubscription) {
      return NextResponse.json({ error: 'User or subscription not found' }, { status: 404 })
    }

    const currentSubscription = user.stripeSubscription

    if (!currentSubscription.subscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
    }

    // Get current subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.subscriptionId)

    // Update subscription in Stripe (this triggers the webhook!)
    const updatedSubscription = await stripe.subscriptions.update(currentSubscription.subscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id, // Current subscription item ID
          price: plans[newPlanId].priceId // New price ID
        }
      ],
      proration_behavior: 'create_prorations' // Pro-rate the difference
    })

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: `Successfully switched to ${plans[newPlanId].name}!`
    })
  } catch (error: any) {
    await createLog('error', `Subscription update failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      stripeErrorCode: error.code || null,
      stripeErrorType: error.type || null
    })
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}
