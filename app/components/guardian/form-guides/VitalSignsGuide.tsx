import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, ChevronDown, ChevronRight, Video } from 'lucide-react'
import { vitalSignsGuide } from '@/app/lib/constants'

const VitalSignsGuide = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('temperature')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="w-full overflow-y-auto h-[calc(100dvh-65px)] mx-auto px-5 pb-5 max-w-md flex-1 border-l-1 border-l-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white pt-4 pb-1 z-10 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">At-Home Vital Signs Guide</h3>
        <p className="text-sm text-gray-600">Learn how to safely monitor your pet&apos;s health at home</p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-red-500 pl-2 py-4 my-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-semibold text-sm">Emergency Signs</h3>
            <p className="text-red-700 text-sm mt-1">
              Contact your veterinarian immediately if you see: blue gums, difficulty breathing, temperature below 99°F
              or above 104°F, or if your pet collapses.
            </p>
          </div>
        </div>
      </div>

      {/* Vital Signs Accordion */}
      <div className="space-y-3">
        {vitalSignsGuide.map((vital) => {
          const Icon = vital.icon
          const isExpanded = expandedSection === vital.id

          return (
            <motion.div
              key={vital.id}
              className={`border-2 rounded-lg overflow-hidden ${vital.borderColor}`}
              initial={false}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(vital.id)}
                className={`w-full p-4 ${vital.bgColor} hover:opacity-80 transition-opacity flex items-center justify-between`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${vital.color}`} />
                  <h3 className="font-semibold text-gray-800">{vital.title}</h3>
                  <div className="text-sm text-gray-600">
                    Normal: {vital.normalRange.dog} (dogs) | {vital.normalRange.cat} (cats)
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white"
                  >
                    <div className="p-4 space-y-4">
                      {/* How To Measure */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          <span>How to Measure</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {vital.howTo.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* When to Be Concerned */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>When to Be Concerned</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {vital.whenToConcern.map((concern, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-yellow-500 mt-1">•</span>
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                          <Video className="w-4 h-4 text-green-500" />
                          <span>Helpful Tips</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {vital.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Footer Tips */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-2">
          <h4 className="font-semibold text-gray-800">General Tips:</h4>
          <ul className="space-y-1">
            <li>• Keep a record of normal values when your pet is healthy</li>
            <li>• Take measurements when your pet is calm and resting</li>
            <li>• If in doubt, it&apos;s always better to contact your veterinarian</li>
            <li>• Some measurements may require two people - one to hold, one to measure</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VitalSignsGuide
