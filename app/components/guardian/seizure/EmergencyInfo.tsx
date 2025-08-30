import React from 'react'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'

const EmergencyInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-red-50 rounded-xl border border-red-200 p-6"
    >
      <div className="flex items-center mb-3">
        <Phone className="w-5 h-5 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold text-red-800">Emergency Guidelines</h3>
      </div>
      <div className="space-y-3 text-sm text-red-700">
        <div>
          <strong>Call vet immediately if:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
            <li>Seizure lasts over 5 minutes</li>
            <li>Multiple seizures in 24 hours</li>
            <li>First-time seizure</li>
            <li>Difficulty breathing after seizure</li>
          </ul>
        </div>
        <div>
          <strong>During seizure:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
            <li>Stay calm and time the episode</li>
            <li>Keep pet safe from injury</li>
            <li>Record video if possible</li>
            <li>Do NOT put hands near mouth</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default EmergencyInfo
