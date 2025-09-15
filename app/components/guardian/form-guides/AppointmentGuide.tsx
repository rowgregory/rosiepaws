import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronDown } from 'lucide-react'
import { quickFacts, tips } from '@/app/lib/constants/public/appointment'

const AppointmentGuide = () => {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (sectionId: any) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className="w-full overflow-y-auto h-[calc(100dvh-65px)] mx-auto px-5 pb-5 max-w-md flex-1 border-l-1 border-l-gray-100">
      {/* Header */}

      <div className="sticky top-0 bg-white pt-4 pb-1 z-10 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Appointment Guidelines</h3>
        <p className="text-sm text-gray-600">Tips for a successful vet visit</p>
      </div>

      {/* Quick Facts Section */}
      <div className="pt-4 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          Quick Facts
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickFacts.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-3">
                <category.icon className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-gray-900 text-sm">{category.title}</span>
              </div>
              <ul className="space-y-1">
                {category.facts.map((fact, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start">
                    <span className="w-1 h-1 bg-indigo-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {fact}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expandable Tips Sections */}
      <div className="divide-y divide-gray-100">
        {tips.map((section, index) => {
          const Icon = section.icon
          const isExpanded = expandedSection === section.id

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${section.color}`}>
                      <Icon className={`w-4 h-4 ${section.iconColor}`} />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{section.title}</span>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <ul className="space-y-2 ml-11">
                        {section.items.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="text-sm text-gray-600 flex items-start"
                          >
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default AppointmentGuide
