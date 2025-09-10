import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Activity, ArrowDown, Droplets, Heart, Plus, Utensils } from 'lucide-react'
import { Pet } from '@/app/types'

const OnboardingBanner: FC<{ pet: Pet }> = ({ pet }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 lg:p-6 mb-6"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-blue-500 rounded-full p-1">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Welcome to {pet.name}&apos;s Health Dashboard!</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Start tracking {pet.name}&apos;s health by clicking on any of the metric cards below to add your first data
            entry.
          </p>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-700">Pain Scores</span>
            </div>
            <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
              <Utensils className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Feedings</span>
            </div>
            <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-gray-700">Water Intakes</span>
            </div>
            <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
              <Plus className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700">And more...</span>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-blue-500"
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
            <span className="text-sm font-medium text-blue-600">Click any grayed-out card below to get started</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default OnboardingBanner
