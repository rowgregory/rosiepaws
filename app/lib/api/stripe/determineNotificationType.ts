interface PlanConfig {
  plan: string
  tokensToAdd: number
  planPrice: number
  userRole: string
  isComfortUser: boolean
  isLegacyUser: boolean
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  COMFORT: {
    plan: 'COMFORT',
    tokensToAdd: 12000,
    planPrice: 1000, // $10.00 in cents
    userRole: 'comfort',
    isComfortUser: true,
    isLegacyUser: false
  },
  LEGACY: {
    plan: 'LEGACY',
    tokensToAdd: 0, // unlimited
    planPrice: 2500, // $25.00 in cents
    userRole: 'legacy',
    isComfortUser: false,
    isLegacyUser: true
  }
}

function determineNotificationType(
  oldSubscription: any,
  newPlan: string,
  cancelAtPeriodEnd: boolean,
  wasInCancelledState: boolean
): 'upgrade' | 'downgrade' | 'cancellation' | 'reactivation' {
  // Check for reactivation FIRST - if user was cancelled and is now getting a new plan
  if (wasInCancelledState) {
    return 'reactivation'
  }

  // Then check for new cancellation (only if they weren't already cancelled)
  if (cancelAtPeriodEnd) {
    return 'cancellation'
  }

  // Use PLAN_CONFIGS to compare plan levels based on price
  const getPlanLevel = (planName: string): number => {
    if (planName === 'FREE') return 0
    const planConfig = PLAN_CONFIGS[planName]
    return planConfig ? planConfig.planPrice : 0
  }

  const oldLevel = getPlanLevel(oldSubscription.plan)
  const newLevel = getPlanLevel(newPlan)

  return newLevel > oldLevel ? 'upgrade' : 'downgrade'
}

export default determineNotificationType
