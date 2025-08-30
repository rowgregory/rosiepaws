import { createStripeInstance } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed for invoice:', invoice.id)

  const stripe = createStripeInstance()

  // Cast to any to handle TypeScript issues with Stripe types
  const invoiceData = invoice as any

  if (!invoiceData.subscription) return

  const subscription = await stripe.subscriptions.retrieve(invoiceData.subscription as string)
  const customer = (await stripe.customers.retrieve(subscription.customer as string)) as Stripe.Customer

  // Find the user
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customer.id }
  })

  if (user) {
    // Update subscription status to indicate payment failure
    await prisma.stripeSubscription.updateMany({
      where: {
        userId: user.id,
        subscriptionId: subscription.id
      },
      data: {
        status: 'past_due' // or whatever status Stripe sends
      }
    })

    // Optionally send notification email
    console.log(`Payment failed for user: ${user.email}`)
    // await sendPaymentFailedEmail(user.email);
  }
}

export default handlePaymentFailed
