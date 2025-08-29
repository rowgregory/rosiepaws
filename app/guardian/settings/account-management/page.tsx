'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import ConformResetModal from '@/app/modals/ConformResetModal'
import ResetLearnMoreModal from '@/app/modals/ResetLearnMoreModal'
import { RootState, useAppSelector } from '@/app/redux/store'

const AccountManagement = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const { zeroPets } = useAppSelector((state: RootState) => state.pet)

  const handleReset = () => {
    setShowResetConfirm(false)
    // Handle reset logic here
  }

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <>
          {/* Reset Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex flex-shrink-0 items-center justify-center w-10 h-10 bg-red-100 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Reset Settings</h2>
                  <p className="text-sm text-gray-600">Reset your application settings to default values</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-red-900 mb-2">Reset All Settings</h4>
                    <p className="text-sm text-red-700 mb-4 leading-relaxed">
                      This will reset all application settings, preferences, and configurations to their default values.
                      This action cannot be undone and may affect your user experience.
                    </p>
                    <div className="flex flex-col lg:flex-row gap-3">
                      <motion.button
                        disabled={true}
                        onClick={() => setShowResetConfirm(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                      >
                        Reset Settings
                      </motion.button>
                      <button
                        onClick={() => setShowLearnMore(true)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>

        {/* Reset Confirmation Modal */}
        <ConformResetModal
          showResetConfirm={showResetConfirm}
          setShowResetConfirm={setShowResetConfirm}
          handleReset={handleReset}
          setShowLearnMore={setShowLearnMore}
          zeroPets={zeroPets}
        />

        {/* Learn More Reset Modal */}
        <ResetLearnMoreModal
          showLearnMore={showLearnMore}
          setShowLearnMore={setShowLearnMore}
          setShowResetConfirm={setShowResetConfirm}
        />
      </div>
    </div>
  )
}

export default AccountManagement
