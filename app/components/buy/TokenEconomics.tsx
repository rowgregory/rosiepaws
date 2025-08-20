import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

const TokenEconomics = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 px-8 py-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">Usage-Based Pricing Model</h2>
              <p className="text-gray-300 text-sm">Transparent pricing aligned with platform utilization</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Tokens Work</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-gray-700 font-medium">Basic Health Data Entry</p>
                    <p className="text-gray-600 text-sm">75-90 tokens per entry (pain, feeding, water)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-gray-700 font-medium">Medical Monitoring</p>
                    <p className="text-gray-600 text-sm">225-275 tokens per entry (medications, appointments)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-gray-700 font-medium">Critical Health Data</p>
                    <p className="text-gray-600 text-sm">400-500 tokens per entry (blood sugar, seizures)</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Proposition</h3>
              <p className="text-gray-600 leading-relaxed">
                Our token-based system ensures you only pay for the features you use while encouraging efficient data
                management. This model scales with your needs and provides transparent cost control for both individual
                pet owners and families with multiple pets.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900 font-medium text-sm">
                  Free tier: 180 tokens daily. Comfort: 12,000 monthly. Legacy: Unlimited usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TokenEconomics
