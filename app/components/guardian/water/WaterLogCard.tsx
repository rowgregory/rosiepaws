import { getMoodColor, getMoodEmoji, getTimeInfo, getWaterIntakeConfig } from '@/app/lib/utils'
import { IWater } from '@/app/types'
import { motion } from 'framer-motion'

interface WaterLogCardProps {
  waterLog: IWater
  index: number
  config: ReturnType<typeof getWaterIntakeConfig>
  IconComponent: React.ComponentType<any>
}

const WaterLogCard: React.FC<WaterLogCardProps> = ({ waterLog, index, config, IconComponent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm">💧</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{waterLog.pet?.name}</h3>
              <p className="text-xs text-gray-500">{getTimeInfo(waterLog.createdAt)?.relative}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
            <IconComponent className="w-3 h-3" />
            <span className="font-medium capitalize">Exact</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          {/* Water Amount or Relative Intake */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount</span>
            {waterLog.milliliters && !isNaN(parseInt(waterLog.milliliters)) ? (
              <span className="font-bold text-blue-600 text-lg">{waterLog.milliliters}ml</span>
            ) : (
              <span className="font-bold text-blue-600 text-lg capitalize">Exact</span>
            )}
          </div>

          {/* Intake Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Type</span>
            <span className="font-medium text-gray-900 capitalize">{waterLog.intakeType}</span>
          </div>

          {/* Mood Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Mood</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getMoodEmoji(waterLog.moodRating)}</span>
              <span className={`font-semibold ${getMoodColor(waterLog.moodRating)}`}>{waterLog.moodRating}/4</span>
            </div>
          </div>

          {/* Time Recorded */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Recorded</span>
            <span className="text-sm text-gray-900">{getTimeInfo(new Date(waterLog.timeRecorded))?.time}</span>
          </div>

          {/* Notes (if present) */}
          {waterLog.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Notes:</p>
              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">&quot;{waterLog.notes}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-[12px] text-center ${config.bgColor} ${config.textColor}`}>
              {config.description}
            </div>
            <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">View Details</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WaterLogCard
