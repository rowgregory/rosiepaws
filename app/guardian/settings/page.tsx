'use client'

import { AlertTriangle } from 'lucide-react'
import React from 'react'

const GuardianSettings = () => {
  const handleResetSettings = (e: any) => {
    e.preventDefault()
  }

  return (
    <>
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">App Settings</h1>
            <p className="text-sm sm:text-base text-gray-600">Customize your pet care app experience</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h2>

            {/* Reset Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Reset</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-900">Reset All Settings</h4>
                    <p className="text-xs text-red-700 mt-1">
                      This will reset all app settings to their default values. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleResetSettings}
                      className="mt-3 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      Reset Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GuardianSettings
