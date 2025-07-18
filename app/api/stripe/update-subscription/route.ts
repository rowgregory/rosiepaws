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

    // Define your subscription plans (same as checkout)
    const plans: Record<string, { priceId: string; name: string }> = {
      basic: { priceId: 'price_xxxxx', name: 'Basic Plan' },
      pro: { priceId: 'price_yyyyy', name: 'Pro Plan' },
      premium: { priceId: 'price_zzzzz', name: 'Premium Plan' }
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
    const subscriptionData = stripeSubscription as any

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(currentSubscription.subscriptionId, {
      items: [
        {
          id: subscriptionData.items.data[0].id, // Current subscription item ID
          price: plans[newPlanId].priceId // New price ID
        }
      ],
      proration_behavior: 'create_prorations' // Pro-rate the difference
    })

    // Get the new price details
    const newPrice = await stripe.prices.retrieve(plans[newPlanId].priceId)

    // Map plan to user roles
    const planMapping: Record<string, { name: string; userRole: string }> = {
      basic: { name: 'basic', userRole: 'basic' },
      pro: { name: 'pro', userRole: 'premium' },
      premium: { name: 'premium', userRole: 'premium' }
    }

    const planInfo = planMapping[newPlanId]

    // Update subscription in your database
    await prisma.stripeSubscription.update({
      where: { id: currentSubscription.id },
      data: {
        plan: planInfo.name,
        planPrice: (newPrice as any).unit_amount || 0,
        status: (updatedSubscription as any).status,
        currentPeriodEnd: new Date((updatedSubscription as any).current_period_end * 1000)
      }
    })

    // Update user role
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     isBasicUser: planInfo.userRole === 'basic',
    //     isPremiumUser: planInfo.userRole === 'premium',
    //     role: planInfo.userRole
    //   }
    // })

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: `Successfully upgraded to ${plans[newPlanId].name}!`
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
    return NextResponse.json({ error: 'Failed to upgrade subscription' }, { status: 500 })
  }
}
