import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Coins, Sparkles } from 'lucide-react'
import { tokenActions } from '@/app/lib/constants'

const TokenActions = () => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Health Tracking Actions</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Each health logging action requires tokens to record vital information for disabled or end-of-life pet care.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokenActions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-pink-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg">
                  <Icon className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{action.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{action.cost} tokens</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-cyan-600" />
          <h3 className="text-lg font-semibold text-gray-900">Token Management Tips</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-cyan-100">
            <h4 className="font-medium text-gray-900 mb-2">Essential Care Priority</h4>
            <p className="text-sm text-gray-600">
              Free users should prioritize pain (75), feeding (85), and water (90) logs for basic comfort monitoring.
              These are the most important daily metrics.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-cyan-100">
            <h4 className="font-medium text-gray-900 mb-2">Advanced Health Tracking</h4>
            <p className="text-sm text-gray-600">
              Paid subscribers can track movements (225), medications (225), blood sugar (300), and seizures (400) for
              comprehensive medical documentation.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TokenActions
