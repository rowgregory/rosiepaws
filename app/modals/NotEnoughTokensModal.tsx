import React from 'react'
import { X, AlertCircle, CreditCard, Zap } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseNotEnoughTokensModal } from '../redux/features/appSlice'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

const NotEnoughTokensModal = () => {
  const dispatch = useAppDispatch()
  const { notEnoughTokensModal, tokensNeeded } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseNotEnoughTokensModal())
  const { user } = useAppSelector((state: RootState) => state.user)

  if (!notEnoughTokensModal) return null

  const tokensShort = Math.max(0, tokensNeeded - user.tokens)

  return (
    <AnimatePresence>
      {notEnoughTokensModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgb(243, 244, 246)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200"
            >
              <X size={20} />
            </motion.button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3, ease: 'backOut' }}
                className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-amber-100 rounded-full"
              >
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-2xl font-semibold text-gray-900 mb-2"
              >
                Insufficient Tokens
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-gray-600 leading-relaxed"
              >
                You need more tokens to complete this action. Upgrade your plan to get additional tokens and continue
                using our services.
              </motion.p>
            </div>

            {/* Token Info */}
            <div className="px-6 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="bg-gray-50 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Current Balance</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{user.tokens.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Tokens Required</span>
                  <span className="text-lg font-semibold text-gray-900">{tokensNeeded.toLocaleString()}</span>
                </div>
                <hr className="my-3 border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-700">Additional Needed</span>
                  <span className="text-lg font-semibold text-red-600">{tokensShort.toLocaleString()}</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="space-y-3"
              >
                <Link href="/buy" onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Upgrade
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Cancel
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotEnoughTokensModal
