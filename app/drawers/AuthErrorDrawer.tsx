import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Clock } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseAuthErrorDrawer } from '../redux/features/appSlice'

const AuthErrorDrawer = () => {
  const dispatch = useAppDispatch()
  const { authErrorDrawer } = useAppSelector((state: RootState) => state.app)
  const closeDrawer = () => dispatch(setCloseAuthErrorDrawer())

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  return (
    <AnimatePresence>
      {authErrorDrawer && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeDrawer}
            className="fixed inset-0 bg-black backdrop-blur-md bg-opacity-50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="min-h-dvh max-w-lg w-full fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-2 bg-white">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Content Container */}
            <div className="flex-1 bg-white px-6 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Login Link Expired</h3>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Message Content */}
              <div className="mb-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg mt-0.5">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed font-medium mb-2">Your magic link has expired</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      For security reasons, login links are only valid for 15 minutes. Please request a new magic link
                      to continue logging in.
                    </p>
                  </div>
                </div>

                {/* Additional Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-blue-800 text-sm font-medium mb-1">Quick Tip</p>
                      <p className="text-blue-700 text-sm">
                        Check your email for the newest magic link, or request a new one below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    closeDrawer()
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Request New Magic Link
                </motion.button>
              </div>

              {/* Footer Help Text */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500">Having trouble? Contact support for assistance</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AuthErrorDrawer
