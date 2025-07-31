import React, { FC } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { motion } from 'framer-motion'
import { IFeeding } from '@/app/types'
import { formatDate, getFoodTypeConfig, getMoodEmoji, getTimeInfo } from '@/app/lib/utils'

const LatestFeeding: FC<{ feeding: IFeeding }> = ({ feeding }) => {
  const latest = feeding
  const latestFoodType = getFoodTypeConfig(latest?.foodType || 'dry')
  const moodEmoji = getMoodEmoji(latest?.moodRating)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Latest Feeding</h2>
              <p className="text-sm text-gray-500">Most recent activity</p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Pet Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-lg">{latest?.pet?.type === 'DOG' ? '🐶' : '🐱'}</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{latest?.pet?.name}</h3>
              <p className="text-sm text-gray-500">{getTimeInfo(latest?.createdAt)?.relative}</p>
            </div>
          </div>

          {/* Feeding Details */}
          <div className="flex items-center space-x-6">
            {/* Food Type Badge */}
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${latestFoodType.avatarBg} border ${latestFoodType.border}`}
            >
              <span className="text-sm">{latestFoodType.icon}</span>
              <span className="font-medium text-sm text-gray-700">{latestFoodType.name}</span>
            </div>

            {/* Amount Badge */}
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
              <span className="font-semibold text-sm text-amber-700">{latest?.foodAmount}</span>
              <span className="text-sm text-amber-600">cup{+latest?.foodAmount > 1 ? 's' : ''}</span>
            </div>

            {/* Mood Badge */}
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200">
              <span className="text-sm">{moodEmoji}</span>
              <span className="font-medium text-sm text-purple-700">{latest?.moodRating}/4</span>
            </div>

            {/* Time */}
            <div className="text-right text-sm">
              <p className="font-medium text-gray-900">
                {formatDate(latest?.timeRecorded || latest?.createdAt, {
                  includeSeconds: true,
                  includeTime: true
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LatestFeeding
