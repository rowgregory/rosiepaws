import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createStripeInstance, getStripeWebhookSecret } from '@/app/lib/utils/common/stripe'
import handleCheckoutSessionCompleted from '../webhook-helpers/handleCheckoutSessionCompleted'
import handleInvoicePaymentSuccess from '../webhook-helpers/handleInvoicePaymentSuccess'
import handleInvoicePaymentFailed from '../webhook-helpers/handleInvoicePaymentFailed'
import handleCustomerSubscriptionUpdated from '../webhook-helpers/handleCustomerSubscriptionUpdated'
import handleCustomerSubscriptionDeleted from '../webhook-helpers/handleCustomerSubscriptionDeleted'
import handlePaymentIntentPaymentFailed from '../webhook-helpers/handlePaymentIntentPaymentFailed'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  if (!sig) {
    return NextResponse.json({ message: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event

  const stripe = createStripeInstance()
  const endpointSecret = getStripeWebhookSecret()

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, message: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      // fires after the user has paid
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice

        // Only handle subscription invoices, but skip initial subscription creation
        if ((invoice as any).subscription && invoice.billing_reason !== 'subscription_create') {
          await handleInvoicePaymentSuccess(invoice)
        }
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.updated':
        console.log('CUSTOMER SUBSCRIPTION UPDATED')
        await handleCustomerSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleCustomerSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentPaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, message: 'Webhook handler failed' }, { status: 500 })
  }
}
