import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Diamond } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseSubscriptionModal } from '../redux/features/appSlice'

const SubscriptionManagementModal = () => {
  const { subsctiptionModal } = useAppSelector((state: RootState) => state.app)
  const dispatch = useAppDispatch()

  const menuItems = [
    { label: 'Update Payment Method', hasArrow: true },
    { label: 'View Invoices', hasArrow: true },
    { label: 'Cancel Your Subscription', hasArrow: true }
  ]

  const modalVariants: any = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  }

  const overlayVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const slideVariants: any = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  }

  const close = () => dispatch(setCloseSubscriptionModal())

  return (
    <AnimatePresence>
      {subsctiptionModal && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1000px] h-[700px] overflow-hidden border border-gray-200">
              <div className="flex h-full">
                {/* Left Image Section */}
                <div className="w-80 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 relative overflow-hidden">
                  {/* Image placeholder - replace with your own image */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <div className="text-white/50 text-center">
                      <div className="w-24 h-24 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <span className="text-sm">Your Image</span>
                      </div>
                      <p className="text-sm">Insert your image here</p>
                    </div>
                  </div>

                  {/* Bottom section with diamond icon */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-6">
                    <div className="flex items-center justify-center">
                      <div className="bg-purple-600 rounded-full p-4 mb-4">
                        <Diamond className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <motion.div
                      variants={slideVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <h3 className="text-white font-medium text-lg mb-1">Manage</h3>
                      <h3 className="text-purple-300 font-medium text-lg">Subscription</h3>
                    </motion.div>
                  </div>
                </div>

                {/* Right Content Section */}
                <div className="flex-1 p-8 relative bg-white">
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={close}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>

                  {/* Header */}
                  <motion.div
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <h2 className="text-gray-900 text-2xl font-semibold mb-6">Manage Subscription</h2>
                    <p className="text-gray-600 text-lg">How can we help you today?</p>
                  </motion.div>

                  {/* Menu Items */}
                  <div className="space-y-2 mb-8">
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.8)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-left transition-all duration-200 group border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">{item.label}</span>
                          {item.hasArrow && (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Close Button */}
                  <div className="w-full flex justify-center">
                    <motion.button
                      variants={slideVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.6 }}
                      onClick={close}
                      className="w-fit px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors border border-gray-300"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SubscriptionManagementModal
