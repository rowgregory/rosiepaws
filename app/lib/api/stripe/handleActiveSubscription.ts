import Stripe from 'stripe'
import determinePlanFromSubscription from './determinePlanFromSubscription'
import { createLog } from '../createLog'
import prisma from '@/prisma/client'
import determineNotificationType, { PLAN_CONFIGS } from './determineNotificationType'
import sendPusherNotification from './sendPusherNotification'

async function handleActiveSubscription(subscription: Stripe.Subscription, stripeSubscription: any) {
  const cancelAtPeriodEnd = subscription.cancel_at_period_end
  const currentPeriodEnd = (subscription as any).current_period_end
  const newPlan = determinePlanFromSubscription(subscription)
  //   console.log('stripeSubscription: ', stripeSubscription)

  // Determine if this is a reactivation/upgrade from a cancelled state
  const wasInCancelledState = stripeSubscription.cancelAtPeriodEnd === true

  const subscriptionUpdateData: any = {
    plan: newPlan,
    status: subscription.status,
    cancelAtPeriodEnd: cancelAtPeriodEnd,
    updatedAt: new Date()
  }

  // Helper function to safely convert Unix timestamp to ISO string
  const safeTimestampToISO = (timestamp: number | null | undefined): string | null => {
    if (!timestamp || timestamp <= 0) {
      return null
    }

    try {
      const date = new Date(timestamp * 1000)
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return null
      }
      return date.toISOString()
    } catch (error) {
      createLog('warning', 'Invalid timestamp conversion', {
        location: ['webhook - handleActiveSubscription'],
        timestamp: timestamp,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return null
    }
  }

  // Handle currentPeriodEnd based on subscription state
  if (cancelAtPeriodEnd) {
    // User cancelled subscription but it's still active until period end
    const periodEndISO = safeTimestampToISO(currentPeriodEnd)

    subscriptionUpdateData.currentPeriodEnd = periodEndISO

    const finalPeriodEnd = periodEndISO || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    subscriptionUpdateData.currentPeriodEnd = finalPeriodEnd

    await createLog('info', 'Subscription cancelled but still active', {
      location: ['webhook - handleActiveSubscription'],
      userId: stripeSubscription.userId,
      plan: newPlan,
      accessUntil: periodEndISO,
      originalTimestamp: currentPeriodEnd
    })
  } else {
    // Active subscription or reactivation
    if (wasInCancelledState) {
      // User reactivated or upgraded from cancelled state
      // Set currentPeriodEnd to null to clear the "ending soon" state
      subscriptionUpdateData.currentPeriodEnd = null
      subscriptionUpdateData.cancelAtPeriodEnd = false

      await createLog('info', 'Subscription reactivated/upgraded from cancelled state', {
        location: ['webhook - handleActiveSubscription'],
        userId: stripeSubscription.userId,
        previousPlan: stripeSubscription.plan,
        newPlan: newPlan,
        wasInCancelledState: true
      })
    } else {
      // Regular active subscription - keep the billing cycle end date
      const periodEndISO = safeTimestampToISO(currentPeriodEnd)
      subscriptionUpdateData.currentPeriodEnd = periodEndISO

      await createLog('info', 'Active subscription updated', {
        location: ['webhook - handleActiveSubscription'],
        userId: stripeSubscription.userId,
        plan: newPlan,
        nextBilling: periodEndISO,
        originalTimestamp: currentPeriodEnd
      })
    }
  }

  // Get plan configuration for user updates
  const planConfig = PLAN_CONFIGS[newPlan] || null

  // Prepare user updates based on plan
  const userUpdateData: any = {
    updatedAt: new Date()
  }

  if (planConfig) {
    // Update user fields based on plan config
    userUpdateData.role = planConfig.userRole
    userUpdateData.isComfortUser = planConfig.isComfortUser
    userUpdateData.isLegacyUser = planConfig.isLegacyUser

    // Handle token updates - add tokens when moving TO comfort (from any other plan)
    // BUT NOT when cancelling (cancelAtPeriodEnd = true) or reactivating same plan
    const oldPlan = stripeSubscription.plan || 'FREE'
    const isActualPlanChange = newPlan !== oldPlan
    const isMovingToComfort = newPlan === 'COMFORT' && isActualPlanChange
    const isCancellation = cancelAtPeriodEnd === true

    if (isMovingToComfort && !isCancellation && planConfig.tokensToAdd > 0) {
      // Add tokens to user's current tokens
      const currentTokens = stripeSubscription.user?.tokens || 0
      userUpdateData.tokens = currentTokens + planConfig.tokensToAdd

      await createLog('info', 'Adding tokens to user - moving to comfort plan', {
        location: ['webhook - handleActiveSubscription'],
        userId: stripeSubscription.userId,
        oldPlan: oldPlan,
        newPlan: newPlan,
        currentTokens: currentTokens,
        tokensToAdd: planConfig.tokensToAdd,
        newTokenTotal: userUpdateData.tokens
      })
    } else {
      await createLog('info', 'Not adding tokens', {
        location: ['webhook - handleActiveSubscription'],
        userId: stripeSubscription.userId,
        oldPlan: oldPlan,
        newPlan: newPlan,
        isActualPlanChange: isActualPlanChange,
        isMovingToComfort: isMovingToComfort,
        isCancellation: isCancellation,
        reason: isCancellation ? 'cancellation' : !isActualPlanChange ? 'same plan' : 'not moving to comfort'
      })
    }
  }

  try {
    // Update both subscription and user in a transaction
    await prisma.$transaction([
      // Update stripe subscription
      prisma.stripeSubscription.update({
        where: { id: stripeSubscription.id },
        data: subscriptionUpdateData
      }),

      // Update user
      prisma.user.update({
        where: { id: stripeSubscription.userId },
        data: userUpdateData
      })
    ])

    await createLog('info', 'Successfully updated subscription and user', {
      location: ['webhook - handleActiveSubscription'],
      userId: stripeSubscription.userId,
      subscriptionUpdates: subscriptionUpdateData,
      userUpdates: userUpdateData
    })
  } catch (updateError) {
    await createLog('error', 'Failed to update subscription and user', {
      location: ['webhook - handleActiveSubscription'],
      userId: stripeSubscription.userId,
      error: updateError instanceof Error ? updateError.message : 'Unknown error',
      subscriptionUpdates: subscriptionUpdateData,
      userUpdates: userUpdateData
    })
    throw updateError
  }

  // Send Pusher notification based on the change type
  const notificationType = determineNotificationType(
    stripeSubscription,
    newPlan,
    cancelAtPeriodEnd,
    wasInCancelledState
  )

  await sendPusherNotification(stripeSubscription.userId, {
    success: true,
    planName: newPlan,
    type: notificationType,
    currentPeriodEnd: subscriptionUpdateData.currentPeriodEnd,
    timestamp: new Date().toISOString()
  })
}

export default handleActiveSubscription
