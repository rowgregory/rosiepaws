import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Calendar, Bell, FileText } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseFirstPetModal } from '../redux/features/appSlice'
import { MotionLink } from '../components/common/MotionLink'

const FirstPetModal = () => {
  const dispatch = useAppDispatch()
  const { firstPetModal, petName } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseFirstPetModal())

  return (
    <AnimatePresence>
      {firstPetModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <Heart className="w-6 h-6 text-pink-500 fill-current" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-900">Congratulations!</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
                    className="text-4xl mb-3"
                  >
                    🎉
                  </motion.div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    You&apos;ve created your first pet profile!
                  </p>
                  <p className="text-gray-600 mb-6">
                    Welcome <span className="font-medium text-pink-600">{petName}</span> to your family! Now you can
                    start tracking everything that matters.
                  </p>
                </div>

                {/* Features List */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">What you can do now:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        Monitor pain levels and comfort with detailed assessments
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">Document eating habits and meal preferences</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700">Track daily water intake and hydration patterns</span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <MotionLink
                  href="/guardian/dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => {
                    onClose()
                  }}
                  className="block w-full bg-gradient-to-r from-pink-600 via-orange-600 to-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  Start Tracking
                </MotionLink>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FirstPetModal
