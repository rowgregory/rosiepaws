import { createLog } from '@/app/lib/api/createLog'
import prisma from '@/prisma/client'
import Stripe from 'stripe'
import handleActiveSubscription from '@/app/lib/api/stripe/handleActiveSubscription'
import handleSubscriptionDowngrade from '@/app/lib/api/stripe/handleSubscriptionDowngrade'

async function handleCustomerSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  const subscriptionStatus = subscription.status

  try {
    // Find the subscription record
    const stripeSubscription = await prisma.stripeSubscription.findFirst({
      where: { subscriptionId: subscriptionId },
      include: {
        user: {
          select: { id: true, email: true, tokens: true }
        }
      }
    })

    if (!stripeSubscription) {
      await createLog('error', 'Subscription updated but no subscription record found', {
        location: ['webhook - customer.subscription.updated'],
        name: 'SubscriptionUpdatedNoRecord',
        timestamp: new Date().toISOString(),
        customerId: customerId,
        subscriptionId: subscriptionId,
        subscriptionStatus: subscriptionStatus
      })
      return
    }

    // Log subscription state for debugging
    await createLog('info', 'Processing subscription update', {
      location: ['webhook - customer.subscription.updated'],
      subscriptionId: subscriptionId,
      status: subscriptionStatus,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentStatus: stripeSubscription.status,
      currentCancelAtPeriodEnd: stripeSubscription.cancelAtPeriodEnd
    })

    // Handle bad status changes (downgrades to free)
    const badStatuses = ['past_due', 'incomplete', 'canceled', 'unpaid', 'incomplete_expired']
    if (badStatuses.includes(subscriptionStatus)) {
      // Only downgrade if subscription still exists in Stripe
      // If it's deleted, let customer.subscription.deleted handle it
      if (subscriptionStatus === 'canceled' && !subscription.canceled_at) {
        // Subscription is being canceled but not deleted yet
        await handleSubscriptionDowngrade(stripeSubscription, subscriptionStatus)
      } else if (subscriptionStatus !== 'canceled') {
        // Handle other bad statuses (past_due, unpaid, etc.)
        await handleSubscriptionDowngrade(stripeSubscription, subscriptionStatus)
      }
      return
    }

    // Handle active subscription updates
    if (subscriptionStatus === 'active') {
      await handleActiveSubscription(subscription, stripeSubscription)
    } else {
      // Log unhandled subscription status
      await createLog('warning', 'Unhandled subscription status', {
        location: ['webhook - customer.subscription.updated'],
        subscriptionId: subscriptionId,
        status: subscriptionStatus,
        customerId: customerId
      })
    }
  } catch (error) {
    await createLog('error', 'Error handling subscription update', {
      location: ['webhook - customer.subscription.updated'],
      name: 'SubscriptionUpdateError',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })

    // Re-throw so webhook returns 500 and Stripe retries
    throw error
  }
}

export default handleCustomerSubscriptionUpdated
