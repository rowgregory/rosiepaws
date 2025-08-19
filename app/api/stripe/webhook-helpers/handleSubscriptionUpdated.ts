import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionData = subscription as any

  // Find the subscription record
  const stripeSubscription = await prisma.stripeSubscription.findFirst({
    where: { subscriptionId: subscription.id }
  })

  if (!stripeSubscription) {
    console.error('No subscription found for subscription:', subscription.id)
    return
  }

  // Handle bad status changes (downgrades to free)
  if (['past_due', 'incomplete', 'canceled', 'unpaid'].includes(subscriptionData.status)) {
    await prisma.stripeSubscription.update({
      where: { id: stripeSubscription.id },
      data: { status: subscriptionData.status }
    })

    // Downgrade user to free
    await prisma.user.update({
      where: { id: stripeSubscription.userId },
      data: {
        isFreeUser: true,
        isComfortUser: false,
        isLegacyUser: false,
        role: 'FREE'
      }
    })
    return
  }

  // Handle plan changes (Comfort ↔ Legacy)
  const priceId = subscription.items.data[0]?.price.id
  let plan = 'COMFORT'
  let tokensToAdd = 0
  let planPrice = 1000

  if (priceId === process.env.STRIPE_COMFORT_MONTHLY_PRICE_ID) {
    plan = 'COMFORT'
    tokensToAdd = 12000
    planPrice = 1000 // $10.00 in cents
  } else if (priceId === process.env.STRIPE_LEGACY_MONTHLY_PRICE_ID) {
    plan = 'LEGACY'
    tokensToAdd = 0 // unlimited
    planPrice = 2500 // $25.00 in cents
  }

  // Only update if plan actually changed
  if (stripeSubscription.plan !== plan) {
    await prisma.stripeSubscription.update({
      where: { id: stripeSubscription.id },
      data: {
        status: subscriptionData.status,
        plan: plan,
        planPrice: planPrice,
        tokensIncluded: tokensToAdd,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })

    // Update user role and add tokens for the new plan
    const updateData: any = {
      isFreeUser: false,
      isComfortUser: plan === 'COMFORT',
      isLegacyUser: plan === 'LEGACY',
      role: plan.toLowerCase() // 'comfort' or 'legacy'
    }

    // Only add tokens for Comfort users (Legacy is unlimited)
    if (plan === 'COMFORT') {
      updateData.tokens = { increment: tokensToAdd }
    }

    await prisma.user.update({
      where: { id: stripeSubscription.userId },
      data: updateData
    })
  }
}

export default handleSubscriptionUpdated
