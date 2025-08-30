import { createStripeInstance, getStripeProductIds } from '@/app/lib/utils/common/stripe'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
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

    const session = await stripe.checkout.sessions.create({
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
      payment_method_types: ['card', 'link', 'us_bank_account', 'paypal'],
      billing_address_collection: 'required',
      metadata: {
        userId: userId,
        planId: planId
      }
    } as Stripe.Checkout.SessionCreateParams)

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
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
