import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, AlertTriangle, CheckCircle, TrendingUp, Eye, Droplets, ChevronDown, ChevronUp } from 'lucide-react'
import { normalRanges, symptoms, tips, warningLevels } from '@/app/lib/constants'

const GuardianBloodSugarGuide = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('ranges')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="w-full max-w-md bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Blood Sugar Guide</h2>
            <p className="text-sm text-gray-500">Essential information for pet owners</p>
          </div>
        </div>

        {/* Normal Ranges */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('ranges')}
            className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Normal Ranges</span>
            </div>
            {expandedSection === 'ranges' ? (
              <ChevronUp className="w-4 h-4 text-green-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-green-600" />
            )}
          </button>

          {expandedSection === 'ranges' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {normalRanges.map((range, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{range.pet}</span>
                    <span className="text-2xl">{range.icon}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Normal:</span>
                      <span className="font-medium text-green-600">{range.normal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fasting:</span>
                      <span className="font-medium text-green-600">{range.fasting}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Warning Levels */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('warnings')}
            className="w-full flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-800">Warning Levels</span>
            </div>
            {expandedSection === 'warnings' ? (
              <ChevronUp className="w-4 h-4 text-orange-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-600" />
            )}
          </button>

          {expandedSection === 'warnings' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {warningLevels.map((level, index) => {
                const IconComponent = level.icon
                return (
                  <div key={index} className={`p-3 rounded-lg border ${level.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium text-sm">{level.level}</span>
                      </div>
                      <span className="text-xs font-medium">{level.range}</span>
                    </div>
                    <p className="text-xs opacity-75">{level.action}</p>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>

        {/* Symptoms */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('symptoms')}
            className="w-full flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">Symptoms to Watch</span>
            </div>
            {expandedSection === 'symptoms' ? (
              <ChevronUp className="w-4 h-4 text-purple-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-purple-600" />
            )}
          </button>

          {expandedSection === 'symptoms' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Low Blood Sugar</span>
                </h4>
                <ul className="space-y-1">
                  {symptoms.low.map((symptom, index) => (
                    <li key={index} className="text-xs text-red-700 flex items-center space-x-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>High Blood Sugar</span>
                </h4>
                <ul className="space-y-1">
                  {symptoms.high.map((symptom, index) => (
                    <li key={index} className="text-xs text-blue-700 flex items-center space-x-1">
                      <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Testing Tips */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('tips')}
            className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Testing Tips</span>
            </div>
            {expandedSection === 'tips' ? (
              <ChevronUp className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {expandedSection === 'tips' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {tips.map((tip, index) => {
                const IconComponent = tip.icon
                return (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-blue-100 rounded">
                        <IconComponent className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{tip.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>

        {/* Emergency Notice */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 text-sm">Emergency Situations</h4>
              <p className="text-xs text-red-700 mt-1">
                If your pet shows signs of severe hypoglycemia (seizures, unconsciousness) or extreme hyperglycemia
                (vomiting, extreme lethargy), contact your veterinarian immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuardianBloodSugarGuide
