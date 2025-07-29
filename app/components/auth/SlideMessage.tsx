import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setCloseSlideMessage } from '@/app/redux/features/appSlice'
import { Check, X } from 'lucide-react'

const SlideMessage = ({ message, type = 'Success!' }: { message: string; type: string }) => {
  const dispatch = useAppDispatch()
  const { slideMessage } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseSlideMessage())

  return (
    <AnimatePresence>
      {slideMessage && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
          />

          {/* Message Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full border border-gray-200"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Message Content */}
            <div className="pr-6">
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-8 h-8 ${type === 'Error' ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}
                  >
                    {type === 'Error' ? (
                      <X className="text-red-600 w-5 h-5" />
                    ) : (
                      <Check className="text-green-600 w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{type}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
                </div>
              </div>

              {/* Optional Action */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SlideMessage
