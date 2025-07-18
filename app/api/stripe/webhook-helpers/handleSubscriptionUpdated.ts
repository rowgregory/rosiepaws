import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionData = subscription as any

  // Only handle "bad" status changes that need immediate action
  if (['past_due', 'incomplete', 'canceled', 'unpaid'].includes(subscriptionData.status)) {
    // Find user and downgrade access
    const stripeSubscription = await prisma.stripeSubscription.findFirst({
      where: { subscriptionId: subscription.id }
    })

    if (stripeSubscription) {
      // Update status and downgrade user
      await prisma.stripeSubscription.update({
        where: { id: stripeSubscription.id },
        data: { status: subscriptionData.status }
      })

      // await prisma.user.update({
      //   where: { id: stripeSubscription.userId },
      //   data: { isBasicUser: false, isPremiumUser: false, role: 'free' }
      // })
    }
  }

  // Skip positive changes (upgrades) since your API handles those
}

export default handleSubscriptionUpdated
