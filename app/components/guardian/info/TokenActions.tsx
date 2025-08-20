import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Coins, Sparkles } from 'lucide-react'
import { tokenActions } from '@/app/lib/constants'

const TokenActions = () => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Health Tracking Actions</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Each health logging action requires tokens. Token costs vary by action type and operation (create, edit,
          delete).
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
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg">
                  <Icon className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{action.name}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Create:</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <span className="font-medium text-gray-700">{action.createCost}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Edit:</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-3 h-3 text-blue-500" />
                    <span className="font-medium text-gray-700">{action.editCost}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delete:</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-3 h-3 text-red-500" />
                    <span className="font-medium text-gray-700">{action.deleteCost}</span>
                  </div>
                </div>
              </div>
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
              Focus on Pain Score (75), Feeding (85), and Water Intake (90) for basic daily care. These provide the most
              critical health insights for your pet&apos;s comfort.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-cyan-100">
            <h4 className="font-medium text-gray-900 mb-2">Advanced Health Tracking</h4>
            <p className="text-sm text-gray-600">
              Movement (275), Medication (275), Blood Sugar (400), and Seizure tracking (500) offer comprehensive
              medical documentation for complex conditions.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-cyan-100">
            <h4 className="font-medium text-gray-900 mb-2">Cost Management</h4>
            <p className="text-sm text-gray-600">
              Edit costs are lower than creation costs. Delete costs are higher to discourage accidental removals. Plan
              your entries carefully to optimize token usage.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-cyan-100">
            <h4 className="font-medium text-gray-900 mb-2">Pro Tip</h4>
            <p className="text-sm text-gray-600">
              Consider upgrading to a paid plan for unlimited access to all tracking features without token limitations
              for comprehensive pet care management.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TokenActions
