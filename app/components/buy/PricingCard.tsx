import { FC, useState } from 'react'
import { setOpenSubscriptionModal } from '@/app/redux/features/appSlice'
import { useAppDispatch } from '@/app/redux/store'
import { useCancelSubscriptionMutation, useCreateCheckoutSessionMutation } from '@/app/redux/services/stripeApi'
import { useRouter } from 'next/navigation'
import { Check, Crown } from 'lucide-react'

interface IPricingCard {
  plan: any
  user?: any
}

const PricingCard: FC<IPricingCard> = ({ plan, user }) => {
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const [createCheckoutSession] = useCreateCheckoutSessionMutation()
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation()
  const [isLoading, setIsLoading] = useState(false)

  // Determine if this is the user's current plan using the boolean flags
  const activePlan = user?.stripeSubscription?.plan?.toLowerCase() === plan.id

  const handlePlanSelect = async (planId: string) => {
    setIsLoading(true)
    const response = await createCheckoutSession({ planId, userId: user?.id }).unwrap()
    if (response.url) {
      push(response.url)
    }
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    const response = await cancelSubscription({ userId: user?.id }).unwrap()
    push(response.url)
  }

  return (
    <div
      className={`relative bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-xl ${
        activePlan
          ? plan.id === 'free'
            ? 'border-gray-400 shadow-lg bg-gray-50'
            : plan.id === 'comfort'
              ? 'border-blue-500 shadow-xl bg-blue-50'
              : 'border-purple-500 shadow-xl bg-purple-50'
          : plan.popular
            ? 'border-blue-600 shadow-xl scale-105'
            : 'border-gray-200 shadow-lg'
      }`}
    >
      {/* Current Plan Badge */}
      {activePlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div
            className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
              plan.id === 'free'
                ? 'bg-gray-600 text-white'
                : plan.id === 'comfort'
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-600 text-white'
            }`}
          >
            <Crown className="w-3 h-3" />
            Current Plan
          </div>
        </div>
      )}

      {/* Popular Badge (only show if not current plan) */}
      {plan.popular && !activePlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</div>
        </div>
      )}

      <div className="p-8">
        {/* Plan Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`text-xl font-semibold ${
                activePlan
                  ? plan.id === 'free'
                    ? 'text-gray-800'
                    : plan.id === 'comfort'
                      ? 'text-blue-700'
                      : 'text-purple-700'
                  : plan.id === 'free'
                    ? 'text-gray-700'
                    : plan.id === 'comfort'
                      ? 'text-blue-600'
                      : 'text-purple-600'
              }`}
            >
              {plan.name}
            </h3>
            {activePlan && (
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  plan.id === 'free'
                    ? 'bg-gray-200 text-gray-700'
                    : plan.id === 'comfort'
                      ? 'bg-blue-200 text-blue-700'
                      : 'bg-purple-200 text-purple-700'
                }`}
              >
                ACTIVE
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-4 h-12 text-sm leading-relaxed">{plan.subtitle}</p>

          <div className="flex items-baseline mb-2">
            <span
              className={`text-4xl font-bold ${
                activePlan
                  ? plan.id === 'free'
                    ? 'text-gray-800'
                    : plan.id === 'comfort'
                      ? 'text-blue-700'
                      : 'text-purple-700'
                  : plan.id === 'free'
                    ? 'text-gray-900'
                    : plan.id === 'comfort'
                      ? 'text-blue-600'
                      : 'text-purple-600'
              }`}
            >
              {plan.price}
            </span>
            <span className="text-gray-600 ml-1">{plan.period}</span>
          </div>

          {plan.id === 'comfort' && (
            <p className={`text-sm font-medium mb-4 ${activePlan ? 'text-blue-700' : 'text-blue-600'}`}>
              67x more tokens than free!
            </p>
          )}
          {plan.id === 'legacy' && (
            <p className={`text-sm font-medium mb-4 ${activePlan ? 'text-purple-700' : 'text-purple-600'}`}>
              Unlimited usage
            </p>
          )}
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature: string, featureIndex: number) => (
            <li key={featureIndex} className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  activePlan
                    ? plan.id === 'free'
                      ? 'bg-gray-200'
                      : plan.id === 'comfort'
                        ? 'bg-blue-200'
                        : 'bg-purple-200'
                    : plan.id === 'free'
                      ? 'bg-gray-100'
                      : plan.id === 'comfort'
                        ? 'bg-blue-100'
                        : 'bg-purple-100'
                }`}
              >
                <Check
                  className={`w-3 h-3 ${
                    activePlan
                      ? plan.id === 'free'
                        ? 'text-gray-700'
                        : plan.id === 'comfort'
                          ? 'text-blue-700'
                          : 'text-purple-700'
                      : plan.id === 'free'
                        ? 'text-gray-600'
                        : plan.id === 'comfort'
                          ? 'text-blue-600'
                          : 'text-purple-600'
                  }`}
                />
              </div>
              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        {plan.id !== 'free' ? (
          <button
            onClick={() => {
              // If user has cancelled this plan, allow reactivation
              if (activePlan && user?.stripeSubscription?.cancelAtPeriodEnd) {
                handlePlanSelect(plan.id) // Reactivate the same plan
              } else if (activePlan) {
                dispatch(setOpenSubscriptionModal()) // Manage current active plan
              } else {
                handlePlanSelect(plan.id) // Upgrade/switch to new plan
              }
            }}
            disabled={isLoading || (activePlan && !user?.stripeSubscription?.cancelAtPeriodEnd)}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors disabled:cursor-not-allowed ${
              activePlan && !user?.stripeSubscription?.cancelAtPeriodEnd
                ? plan.id === 'comfort'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-purple-100 text-purple-700 border border-purple-300'
                : isLoading
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                  : plan.id === 'comfort'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : activePlan && user?.stripeSubscription?.cancelAtPeriodEnd ? (
              'Reactivate Plan'
            ) : activePlan ? (
              'Current Plan'
            ) : user?.isFreeUser ? (
              'Upgrade Now'
            ) : user?.isComfortUser || user?.isLegacyUser ? (
              'Switch Plan'
            ) : (
              'Get Started'
            )}
          </button>
        ) : // Free tier - show different buttons based on user status
        activePlan ? (
          <div className="w-full py-3 px-4 rounded-md text-center font-medium bg-gray-200 text-gray-700 border border-gray-300">
            Current Plan
          </div>
        ) : user?.isComfortUser || user?.isLegacyUser ? (
          <button
            disabled={user?.stripeSubscription?.cancelAtPeriodEnd || isCancelling}
            onClick={() => handleCancelSubscription()} // This would trigger cancellation
            className="w-full py-3 px-4 rounded-md font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:cursor-not-allowed"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        ) : (
          <div className="w-full py-3 px-4 rounded-md text-center font-medium bg-gray-100 text-gray-500">Free</div>
        )}
      </div>
    </div>
  )
}
export default PricingCard
