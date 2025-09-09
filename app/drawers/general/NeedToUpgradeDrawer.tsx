import { backdropVariants, cardVariants, drawerVariants } from '@/app/lib/constants'
import { setCloseNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { RootState, useAppDispatch, useAppSelector, useUserSelector } from '@/app/redux/store'
import { plans } from '@/public/data/home.data'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const NeedToUpgradeDrawer = () => {
  const dispatch = useAppDispatch()
  const [selectedPlan, setSelectedPlan] = useState(null) as any
  const { needToUpgradeDrawer } = useAppSelector((state: RootState) => state.dashboard)
  const { user } = useUserSelector()
  console.log('USER: ', user?.stripeSubscription?.plan)
  const onClose = () => dispatch(setCloseNeedToUpgradeDrawer())
  const { push } = useRouter()

  return (
    <AnimatePresence>
      {needToUpgradeDrawer && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upgrade Required</h2>
                <p className="text-sm text-gray-600 mt-1">Unlock this feature with a premium plan</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              {/* Feature explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-semibold text-gray-900">Premium Feature</span>
                </div>
                <p className="text-gray-600 text-sm">
                  You&apos;re trying to access a premium feature that requires an upgrade. Choose a plan below to unlock
                  this and many other advanced features.
                </p>
              </motion.div>

              {/* Plans */}
              <div className="space-y-4">
                {plans.map((plan, index) => {
                  const Icon = plan.icon
                  return (
                    plan.id !== 'free' &&
                    plan.id !== user?.stripeSubscription?.plan?.toLowerCase() && (
                      <motion.div
                        key={plan.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className={`relative border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-200 ${
                          selectedPlan === plan.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <div
                            className={`absolute -top-3 left-4 sm:left-6 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${plan.gradient}`}
                          >
                            Most Popular
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                          <div className="flex items-center">
                            <div
                              className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${plan.gradient} mr-3 sm:mr-4 flex-shrink-0`}
                            >
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{plan.name}</h3>
                              <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{plan.price}</div>
                            <div className="text-sm text-gray-600">{plan.period}</div>
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="flex-1">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  )
                })}
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-3"
              >
                <button
                  onClick={() => push('/buy')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    selectedPlan
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!selectedPlan}
                >
                  {selectedPlan
                    ? `Upgrade to ${plans.find((p) => p.id === selectedPlan)?.name}`
                    : 'Select a plan first'}
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NeedToUpgradeDrawer
