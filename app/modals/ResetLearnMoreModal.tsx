'use clent'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Database, Download, FileText, Info, Shield, X } from 'lucide-react'
import { RootState, useAppSelector } from '../redux/store'

const ResetLearnMoreModal = ({ showLearnMore, setShowLearnMore, setShowResetConfirm }: any) => {
  const [exportLoading, setExportLoading] = useState(false)
  const { zeroPets } = useAppSelector((state: RootState) => state.pet)

  const handleExportData = () => {
    setExportLoading(true)
  }

  return (
    <AnimatePresence>
      {showLearnMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLearnMore(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Reset Settings Overview</h3>
                    <p className="text-sm text-gray-600 hidden sm:block">Understanding what data will be affected</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLearnMore(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2 sm:hidden">Understanding what data will be affected</p>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* What Gets Reset */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Data That Will Be Permanently Deleted
                </h4>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 text-sm text-red-800">
                      <p className="font-medium">The following data will be permanently removed:</p>
                      <ul className="space-y-1 ml-2 sm:ml-4">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>All pet profiles and information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Health tracking records and logs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Photos and videos in gallery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Care tasks and reminders</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Walk and activity records</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Application preferences and settings</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Gets Preserved */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Data That Will Be Preserved
                </h4>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 text-sm text-green-800">
                      <p className="font-medium">Your account information will remain intact:</p>
                      <ul className="space-y-1 ml-2 sm:ml-4">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>User account and login credentials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Personal profile information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Account security settings</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Recommendation */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Recommended Action
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-3 text-sm text-blue-800">
                      <p className="font-medium">
                        Before proceeding with the reset, we strongly recommend exporting your data.
                      </p>
                      <p>
                        This will create a backup file containing all your pet information, health records, and photos
                        that you can save locally.
                      </p>

                      <motion.button
                        onClick={handleExportData}
                        disabled={exportLoading || zeroPets}
                        whileHover={{ scale: exportLoading ? 1 : 1.02 }}
                        whileTap={{ scale: exportLoading ? 1 : 0.98 }}
                        className="flex items-center gap-2 sm:gap-3 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm w-full sm:w-auto justify-center sm:justify-start"
                      >
                        {exportLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="hidden sm:inline">Preparing Export...</span>
                            <span className="sm:hidden">Exporting...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Export All Data
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">Important Notice</p>
                    <p>
                      Once you confirm the reset, this action cannot be undone. All data will be permanently deleted
                      from our servers and cannot be recovered.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowLearnMore(false)}
                className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors order-2 sm:order-1"
              >
                Close
              </button>
              <motion.button
                onClick={() => {
                  setShowLearnMore(false)
                  setShowResetConfirm(true)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
              >
                Proceed to Reset
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ResetLearnMoreModal
