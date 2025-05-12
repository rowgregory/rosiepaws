import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil' // Make sure to set the appropriate API version
})

// POST /api/stripe/create-payment-method
export async function POST(req: NextRequest) {
  const { paymentMethodId, stripeCustomerId } = await req.json()

  // Attach payment method to Stripe customer
  await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId })

  // Update the customer to use this payment method as the default
  await stripe.customers.update(stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId
    }
  })

  return NextResponse.json({ message: 'Payment method attached successfully' })
}
