import { getBloodSugarStatus, getReadingContext, getTimeInfo, getTimeOfDay } from '@/app/lib/utils'
import { IBloodSugar } from '@/app/types'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { FC } from 'react'

interface BloodSugarCardProps {
  reading: IBloodSugar
  index: number
  status: ReturnType<typeof getBloodSugarStatus>
  StatusIcon: React.ComponentType<any>
}

const BloodSugarCard: FC<BloodSugarCardProps> = ({ reading, index, status, StatusIcon }) => {
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
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{reading.pet?.name}</h3>
              <p className="text-xs text-gray-500">{getTimeInfo(reading.createdAt)?.relative}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="font-medium">{status.label}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          {/* Blood Sugar Value */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Blood Sugar</span>
            <div className="text-right">
              <span className="font-bold text-blue-600 text-xl">{reading.value}</span>
              <span className="text-sm text-gray-500 ml-1">mg/dL</span>
            </div>
          </div>

          {/* Time of Day */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time of Day</span>
            <span className="text-sm text-gray-900">{getTimeOfDay(reading.timeRecorded)}</span>
          </div>

          {/* Exact Time */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Taken At</span>
            <span className="text-sm text-gray-900">{getTimeInfo(new Date(reading.timeRecorded))?.time}</span>
          </div>

          {/* Reading Context */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Assessment:</p>
            <p className={`text-sm font-medium ${status.textColor}`}>{getReadingContext(parseFloat(reading.value))}</p>
          </div>

          {/* Notes (if present) */}
          {reading.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Notes:</p>
              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">&quot;{reading.notes}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-xs ${status.bgColor} ${status.textColor}`}>
              {status.description}
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">View Details</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BloodSugarCard
