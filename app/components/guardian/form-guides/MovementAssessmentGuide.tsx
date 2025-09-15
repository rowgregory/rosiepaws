import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { sections } from '@/app/lib/constants'

const MovementAssessmentGuide = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basics'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  return (
    <div className="w-full overflow-y-auto h-[calc(100dvh-65px)] mx-auto px-5 pb-5 max-w-md flex-1 border-l-1 border-l-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white pt-4 pb-1 z-10 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Movement Assessment Guide</h3>
        <p className="text-sm text-gray-600">
          Essential guidelines for documenting your pet&apos;s movement and mobility
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          const SectionIcon = section.icon

          return (
            <div key={section.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${section.bgColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SectionIcon className={`w-5 h-5 ${section.color}`} />
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white space-y-4">
                      {section.content.map((subsection, index) => (
                        <div key={index}>
                          <h5 className="font-medium text-gray-800 mb-2 text-sm">{subsection.subtitle}</h5>
                          <ul className="space-y-1">
                            {subsection.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`}
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Quick Reference Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-medium">💡 Quick Tip:</p>
          <p>
            Focus on changes from your pet&apos;s baseline rather than absolute values. Every pet&apos;s
            &quot;normal&quot; is different.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovementAssessmentGuide
