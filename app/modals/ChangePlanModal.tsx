import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Crown, Heart, Sparkles, ArrowRight, Gift, AlertTriangle, RotateCcw, Calendar } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector, useUserSelector } from '../redux/store'
import { setCloseChangePlanModal } from '../redux/features/appSlice'

const backdropVariants: any = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

const modalVariants: any = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { duration: 0.3 }
  }
}

const childVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  }
}

const successIconVariants: any = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
      delay: 0.2
    }
  }
}

const sparkleVariants: any = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0.8],
    transition: {
      duration: 0.6,
      delay: 0.4
    }
  }
}

const ChangePlanModal = () => {
  const { changePlanModal } = useAppSelector((state: RootState) => state.app)
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseChangePlanModal())
  const { user } = useUserSelector()

  // Get current plan and subscription status
  const currentPlan = user?.stripeSubscription?.plan
  const subscriptionStatus = user?.stripeSubscription?.status
  const cancelAtPeriodEnd = user?.stripeSubscription?.cancelAtPeriodEnd
  const currentPeriodEnd = user?.stripeSubscription?.currentPeriodEnd

  // Determine the modal type based on subscription changes
  const isUpgrade = currentPlan && ['COMFORT', 'LEGACY'].includes(currentPlan) && !cancelAtPeriodEnd
  const isCancellation = cancelAtPeriodEnd && currentPlan !== 'FREE'
  const isDowngradeToFree = currentPlan === 'FREE' && subscriptionStatus === 'canceled'

  const plans: any = {
    FREE: {
      icon: <Gift className="w-8 h-8 text-green-500" />,
      color: 'green',
      name: 'Free Plan',
      features: ['Basic features', 'Community support', 'Limited usage']
    },
    COMFORT: {
      icon: <Heart className="w-8 h-8 text-blue-500" />,
      color: 'blue',
      name: 'Comfort Plan',
      features: ['Priority support', 'Advanced features', 'Increased token amount']
    },
    LEGACY: {
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      color: 'purple',
      name: 'Legacy Plan',
      features: ['All features', '24/7 premium support', 'Unlimited usage']
    }
  }

  // Format the end date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Determine modal content based on subscription change type
  const getModalContent = () => {
    if (isCancellation) {
      return {
        icon: <AlertTriangle className="w-10 h-10 text-orange-600" />,
        iconBg: 'bg-orange-100',
        title: 'Subscription Cancelled',
        subtitle: `You'll continue to have ${plans[currentPlan].name} access until your billing cycle ends.`,
        gradientFrom: 'from-orange-50',
        gradientTo: 'to-orange-100',
        buttonText: 'Continue with Current Plan',
        buttonGradient:
          'from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600'
      }
    } else if (isDowngradeToFree) {
      return {
        icon: <RotateCcw className="w-10 h-10 text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Welcome back to Free Plan',
        subtitle: "Your subscription has ended and you're now on the Free plan.",
        gradientFrom: 'from-green-50',
        gradientTo: 'to-blue-100',
        buttonText: 'Explore Free Features',
        buttonGradient:
          'from-green-500 via-blue-500 to-blue-600 hover:from-green-600 hover:via-blue-600 hover:to-blue-700'
      }
    } else {
      // Default upgrade/welcome message
      return {
        icon: <Check className="w-10 h-10 text-green-600" />,
        iconBg: 'bg-green-100',
        title: `Welcome to ${plans[currentPlan]?.name}!`,
        subtitle: 'Your purchase was successful and your account has been upgraded.',
        gradientFrom: 'from-blue-50',
        gradientTo: 'to-blue-100',
        buttonText: 'Get Started',
        buttonGradient:
          'from-pink-500 via-orange-500 to-red-500 hover:from-pink-600 hover:via-orange-600 hover:to-red-600'
      }
    }
  }

  const modalContent = getModalContent()

  return (
    <AnimatePresence>
      {changePlanModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="relative p-8 text-center">
              {/* Status Animation */}
              <motion.div className="relative mb-6">
                <motion.div
                  variants={successIconVariants}
                  initial="hidden"
                  animate="visible"
                  className={`w-20 h-20 mx-auto ${modalContent.iconBg} rounded-full flex items-center justify-center mb-4`}
                >
                  {modalContent.icon}
                </motion.div>

                {/* Sparkle effects - only show for upgrades */}
                {isUpgrade && (
                  <>
                    <motion.div
                      variants={sparkleVariants}
                      initial="hidden"
                      animate="visible"
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                    <motion.div
                      variants={sparkleVariants}
                      initial="hidden"
                      animate="visible"
                      className="absolute -bottom-2 -left-2"
                      style={{ animationDelay: '0.2s' }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Status Message */}
              <motion.div variants={childVariants}>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{modalContent.title}</h3>
                <p className="text-gray-600 mb-6">{modalContent.subtitle}</p>
              </motion.div>

              {/* Cancellation Timeline */}
              {isCancellation && currentPeriodEnd && (
                <motion.div
                  variants={childVariants}
                  className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-semibold text-orange-800">Access Until</span>
                  </div>
                  <p className="text-lg font-bold text-orange-900">{formatDate(currentPeriodEnd)}</p>
                  <p className="text-sm text-orange-700 mt-1">After this date, you&apos;ll be moved to the Free plan</p>
                </motion.div>
              )}

              {/* Plan Details */}
              <motion.div
                variants={childVariants}
                className={`bg-gradient-to-r ${modalContent.gradientFrom} ${modalContent.gradientTo} rounded-xl p-6 mb-6`}
              >
                <div className="flex items-center justify-center mb-4">
                  {plans[currentPlan]?.icon}
                  <span className="ml-3 text-xl font-semibold text-gray-800">{plans[currentPlan]?.name}</span>
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 mb-3 text-center">
                    {isCancellation
                      ? 'You still have access to:'
                      : isDowngradeToFree
                        ? "What's available on Free:"
                        : "What's now available:"}
                  </h4>
                  <div className="space-y-2">
                    {plans[currentPlan]?.features.map((feature: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <div
                          className={`w-5 h-5 ${isCancellation ? 'bg-orange-100' : 'bg-green-100'} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <Check className={`w-3 h-3 ${isCancellation ? 'text-orange-600' : 'text-green-600'}`} />
                        </div>
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Additional info for cancellations */}
              {isCancellation && (
                <motion.div variants={childVariants} className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    Changed your mind? You can reactivate your subscription anytime before the end date.
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div variants={childVariants} className="space-y-3">
                <button
                  onClick={onClose}
                  className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${modalContent.buttonGradient} text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center text-sm sm:text-base`}
                >
                  {modalContent.buttonText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </button>
              </motion.div>

              {/* Thank you note */}
              <motion.p variants={childVariants} className="text-xs text-gray-500 mt-4 sm:mt-6">
                {isCancellation
                  ? "We're sorry to see you go 😢"
                  : isDowngradeToFree
                    ? 'Thanks for being with us! 👋'
                    : 'Thank you for choosing us! 🎉'}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ChangePlanModal
