'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Info, PawPrint } from 'lucide-react'
import { guideSections } from '@/app/lib/constants'

const GuardianWalkGuide = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basics'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  return (
    <div className="bg-white shadow-sm border border-gray-100 overflow-hidden max-w-md w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-500 to-amber-500 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Walk Guide</h3>
            <p className="text-blue-100 text-sm">Tips for better walks with your pet</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="h-[calc(100dvh-170px)] overflow-y-auto">
        {guideSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          const IconComponent = section.icon

          return (
            <div key={section.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">{section.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Always consult your vet for pet-specific exercise needs</span>
        </div>
      </div>
    </div>
  )
}

export default GuardianWalkGuide
