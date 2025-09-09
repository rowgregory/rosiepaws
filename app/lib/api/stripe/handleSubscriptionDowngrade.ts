import prisma from '@/prisma/client'
import { createLog } from '../createLog'

async function handleSubscriptionDowngrade(stripeSubscription: any, newStatus: string) {
  const userId = stripeSubscription.userId
  const subscriptionId = stripeSubscription.subscriptionId

  try {
    // Update subscription status and plan
    await prisma.stripeSubscription.update({
      where: { id: stripeSubscription.id },
      data: {
        status: newStatus,
        plan: 'FREE',
        planPrice: 0,
        tokensIncluded: 0
      }
    })

    // Downgrade user to free but KEEP their tokens
    await prisma.user.update({
      where: { id: userId },
      data: {
        isFreeUser: true,
        isComfortUser: false,
        isLegacyUser: false,
        role: 'FREE'
        // NOTE: We intentionally do NOT reset tokens - user keeps them
      }
    })

    await createLog('warning', 'User downgraded to free due to payment failure - tokens preserved', {
      location: ['webhook - customer.subscription.updated'],
      name: 'UserDowngradedToFree',
      timestamp: new Date().toISOString(),
      subscriptionId: subscriptionId,
      userId: userId,
      newStatus: newStatus,
      userEmail: stripeSubscription.user.email,
      reason: `Subscription status changed to ${newStatus}`,
      tokensPreserved: true,
      currentTokens: stripeSubscription.user.tokens
    })
  } catch (error) {
    await createLog('error', 'Error downgrading user to free', {
      location: ['webhook - customer.subscription.updated'],
      name: 'DowngradeError',
      timestamp: new Date().toISOString(),
      subscriptionId: subscriptionId,
      userId: userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export default handleSubscriptionDowngrade
