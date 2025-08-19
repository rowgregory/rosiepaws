import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const planId = body.planId
    const userId = body.userId

    // Define your subscription plans
    const plans: Record<string, { priceId: string; name: string; userRole: string }> = {
      comfort: { priceId: process.env.STRIPE_COMFORT_MONTHLY_PRICE_ID!, name: 'COMFORT', userRole: 'comfort_user' },
      legacy: { priceId: process.env.STRIPE_LEGACY_MONTHLY_PRICE_ID!, name: 'LEGACY', userRole: 'legacy_user' }
    }

    if (!plans[planId]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/guardian/home`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/guardian/home`,
      payment_method_types: ['card', 'link', 'us_bank_account', 'paypal'],
      billing_address_collection: 'required'
    } as Stripe.Checkout.SessionCreateParams)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create checkout session', error }, { status: 500 })
  }
}
