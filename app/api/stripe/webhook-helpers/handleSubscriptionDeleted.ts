import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted webhook received:', subscription.id)

  // Find the subscription in database
  const stripeSubscription = await prisma.stripeSubscription.findFirst({
    where: { subscriptionId: subscription.id }
  })

  if (!stripeSubscription) {
    console.error('Subscription not found:', subscription.id)
    return
  }

  // Update subscription status to canceled
  await prisma.stripeSubscription.update({
    where: { id: stripeSubscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
      subscriptionId: null // Clear the subscription ID since it's deleted
    }
  })

  // Downgrade user to free tier
  await prisma.user.update({
    where: { id: stripeSubscription.userId },
    data: {
      isFreeUser: true,
      isComfortUser: false,
      isLegacyUser: false,
      role: 'Free'
    }
  })

  console.log(`User downgraded to free tier for subscription: ${subscription.id}`)
}

export default handleSubscriptionDeleted
