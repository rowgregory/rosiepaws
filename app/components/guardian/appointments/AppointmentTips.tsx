import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Shield, AlertTriangle, ChevronDown, Info } from 'lucide-react'
import { quickFacts, tips } from '@/app/lib/constants/public/appointment'

const AppointmentTips = () => {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (sectionId: any) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className="bg-white max-w-md rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Info className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Appointment Guide</h3>
            <p className="text-sm text-gray-600">Tips for a successful vet visit</p>
          </div>
        </div>
      </div>

      {/* Quick Facts Section */}
      <div className="p-6 border-b border-gray-100">
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

      {/* Contact Info Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="text-center space-y-2">
          <p className="text-xs font-medium text-gray-700">Need help scheduling?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Call: (555) 123-PETS</span>
            </div>
            <span className="hidden sm:block">•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Hours: 8AM - 6PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-red-50 border-t border-red-200 p-4"
      >
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-700">
            <span className="font-semibold">Emergency?</span> Call our 24/7 hotline: (555) 911-PETS
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AppointmentTips
