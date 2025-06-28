import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import handleCheckoutCompleted from '../webhook-helpers/handleCheckoutCompleted'
import handlePaymentFailed from '../webhook-helpers/handlePaymentFailed'
import handleSubscriptionUpdated from '../webhook-helpers/handleSubscriptionUpdated'
import handleSubscriptionDeleted from '../webhook-helpers/handleSubscriptionDeleted'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

// Stripe webhook secret (You get this from your Stripe dashboard)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Disable the body parsing so that we can get the raw body (required by Stripe)
export const config = {
  api: {
    bodyParser: false
  }
}

// Handle the Stripe webhook events
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  if (!sig) {
    return NextResponse.json({ message: 'Missing Stripe signature' }, { status: 400 })
  }

  console.log('WEBHOOK!')
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    console.log('EVENT!: ', event)
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      // fires after the user has paid
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
