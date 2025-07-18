import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const planId = body.planId
    console.log('PLAN ID ', planId)

    // Define your subscription plans
    const plans: Record<string, { priceId: string; name: string; userRole: string }> = {
      comfort: { priceId: process.env.STRIPE_COMFORT_MONTHLY_PRICE_ID!, name: 'COMFORT', userRole: 'basic_user' },
      companion: { priceId: process.env.STRIPE_COMPANION_MONTHLY_PRICE_ID!, name: 'COMPANION', userRole: 'pro_user' },
      legacy: { priceId: process.env.STRIPE_LEGACY_MONTHLY_PRICE_ID!, name: 'LEGACY', userRole: 'premium_user' }
    }

    if (!plans[planId]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    console.log('plans[planId]: ', plans[planId])

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: plans[planId].priceId,
          quantity: 1
        }
      ],

      subscription_data: {
        trial_period_days: 7
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,

      payment_method_types: ['card', 'link', 'us_bank_account', 'paypal'],

      billing_address_collection: 'required'
    } as Stripe.Checkout.SessionCreateParams)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
