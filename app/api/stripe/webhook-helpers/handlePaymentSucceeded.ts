import prisma from '@/prisma/client'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string

  // Find the subscription record
  const stripeSubscription = await prisma.stripeSubscription.findFirst({
    where: { customerId: customerId }
  })

  if (!stripeSubscription) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  // Get full subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update the subscription record
  await prisma.stripeSubscription.update({
    where: { id: stripeSubscription.id },
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      subscriptionId: subscriptionId,
      // Clear any cancellation flags on successful payment
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
    }
  })

  // Log successful payment, send receipt email, etc.
}

export default handlePaymentSucceeded
