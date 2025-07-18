import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { setOpenSubscriptionModal } from '@/app/redux/features/appSlice'
import { useAppDispatch } from '@/app/redux/store'
import { useCreateCheckoutSessionMutation } from '@/app/redux/services/stripeApi'
import { useRouter } from 'next/navigation'

interface IPricingCard {
  plan: any
  index: number
  user?: any
}

const PricingCard: FC<IPricingCard> = ({ plan, index, user }) => {
  const dispatch = useAppDispatch()
  const activePlan = plan.name === user?.stripeSubscription?.plan || (user?.isFreeUser && plan.name === 'Free')

  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation()
  const { push } = useRouter()

  const handlePlanSelect = async (planId: string) => {
    const response = await createCheckoutSession({ planId }).unwrap()
    push(response.url)
  }

  return (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl shadow-lg`}
    >
      <div className="p-4">
        {/* Plan Header */}
        <div className="mb-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
            className={`${activePlan ? 'text-gray-800' : 'bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent'} text-lg text-center font-semibold`}
          >
            {plan.name}
          </motion.span>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
            className="flex items-baseline justify-center mb-4 mt-6"
          >
            <span
              className={`text-4xl font-bold ${activePlan ? 'text-gray-800' : 'bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent'}`}
            >
              {plan.price}
            </span>
            <span className="text-gray-500 ml-1">{plan.period}</span>
          </motion.div>

          {/* CTA Button */}
          {plan.id !== 'free' ? (
            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`h-10 w-full rounded-xl transition-all duration-200 mb-8 ${
                activePlan ? '' : 'bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 p-0.5'
              }`}
            >
              <motion.button
                onClick={() => (activePlan ? dispatch(setOpenSubscriptionModal()) : handlePlanSelect(plan.id))}
                disabled={isLoading}
                className={`w-full h-full font-semibold rounded-xl duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                  activePlan
                    ? 'bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : user?.isFreeUser ? (
                  // Free users see "Subscribe" on all paid plans
                  'Subscribe'
                ) : user?.stripeSubscription ? (
                  // Users with subscription
                  activePlan ? (
                    'Manage Plan'
                  ) : (
                    'Switch Plan'
                  )
                ) : (
                  // Users without subscription (but not free)
                  'Subscribe'
                )}
              </motion.button>
            </motion.div>
          ) : (
            <div className="h-10 w-10 mb-8" />
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
            className={`text-sm text-center text-pink-500 font-medium`}
          >
            Perfect for
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
            className={`text-sm text-center font-medium mb-4`}
          >
            {plan.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
            className="text-gray-600 text-sm"
          >
            {plan.description}
          </motion.p>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8 bg-gray-50 p-2 rounded-2xl">
          {plan.features.map((feature: any, featureIndex: number) => (
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.05 }}
              className="flex"
            >
              <div
                className={`w-4 h-4 border-1 border-[#ef5572] rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
              >
                <svg className="w-3 h-3 text-white" fill="#ef5572" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700 text-sm font-medium">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default PricingCard
