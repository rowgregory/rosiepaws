import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { createStripeInstance, getStripeProductIds } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const body = await req.json()
    const { planId, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const stripeProducts = getStripeProductIds()
    const stripe = createStripeInstance()

    // Define available subscription plans with environment-aware price IDs
    const plans: Record<string, { priceId: string }> = {
      comfort: { priceId: stripeProducts.comfort.priceId },
      legacy: { priceId: stripeProducts.legacy.priceId }
    }

    if (!plans[planId]) {
      return NextResponse.json({ error: 'Invalid plan selected. Available plans: comfort, legacy' }, { status: 400 })
    }

    // Get user with subscription info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
        stripeSubscription: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let customerId = user.stripeCustomerId

    // If user doesn't have a Stripe customer, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        metadata: { userId: user.id }
      })
      customerId = customer.id

      // Update user record with new customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Check if user has existing subscription
    if (user.stripeSubscription?.subscriptionId) {
      // EXISTING SUBSCRIBER - Update subscription directly

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscription.subscriptionId)

      const currentPriceId = subscription.items.data[0].price.id
      const targetPriceId = plans[planId].priceId
      const isCancelled = subscription.cancel_at_period_end

      // Check if they're already on this plan
      if (currentPriceId === targetPriceId && !isCancelled) {
        return NextResponse.json(
          {
            success: false,
            message: `You are already subscribed to the ${planId} plan`,
            currentPlan: planId
          },
          { status: 400 }
        )
      }

      try {
        // Update subscription in Stripe - webhook will handle database updates
        const updatedSubscription = await stripe.subscriptions.update(user.stripeSubscription.subscriptionId, {
          items: [
            {
              id: subscription.items.data[0].id,
              price: targetPriceId
            }
          ],
          proration_behavior: 'always_invoice', // Force immediate billing for upgrades
          cancel_at_period_end: false, // Reactivate if cancelled AND ensure subscription stays active
          payment_settings: {
            payment_method_types: ['card', 'link']
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Subscription updated successfully',
          subscription: updatedSubscription
        })
      } catch (stripeError: any) {
        return NextResponse.json(
          { error: 'Failed to update subscription', details: stripeError.message },
          { status: 500 }
        )
      }
    } else {
      // NEW SUBSCRIBER - Use checkout
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price: plans[planId].priceId,
            quantity: 1
          }
        ],
        client_reference_id: userId,
        success_url: `${req.nextUrl.origin}/guardian/home`,
        cancel_url: `${req.nextUrl.origin}/guardian/home`,
        billing_address_collection: 'required',
        metadata: {
          userId: userId,
          planId: planId
        },
        subscription_data: {
          metadata: {
            userId: userId,
            planId: planId
          }
        }
      })

      if (!session.url) {
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
      }

      return NextResponse.json({ url: session.url })
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
