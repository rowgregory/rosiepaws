import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { ISeizure } from '@/app/types'
import { formatDuration, getRecentSeizures, getTimeInfo } from '@/app/lib/utils'

interface IQuickOverview {
  todaysSeizuresCount: number
  todaysSeizures: ISeizure[]
  seizures: ISeizure[]
  latestSeizure: ISeizure | null
}

const QuickOverview: FC<IQuickOverview> = ({ todaysSeizuresCount, todaysSeizures, seizures, latestSeizure }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
      <div className="space-y-4">
        {/* Today's Activity */}
        {todaysSeizuresCount > 0 && (
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Today&apos;s Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-red-700">Episodes Today</span>
                <span className="font-semibold text-red-900">{todaysSeizuresCount}</span>
              </div>
              {todaysSeizures?.some((s) => s.duration) && (
                <div className="flex justify-between">
                  <span className="text-sm text-red-700">Total Duration</span>
                  <span className="font-semibold text-red-900">
                    {formatDuration(todaysSeizures?.reduce((sum, s) => sum + (s.duration || 0), 0))}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* General Stats */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Episodes</span>
            <span className="font-semibold text-gray-900">{seizures?.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">This Week</span>
            <span className="font-semibold text-red-600">{getRecentSeizures(seizures, 7).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">This Month</span>
            <span className="font-semibold text-orange-600">{getRecentSeizures(seizures, 30).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">With Video</span>
            <span className="font-semibold text-blue-600">{seizures.filter((s) => s.videoUrl).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">With Duration</span>
            <span className="font-semibold text-green-600">{seizures.filter((s) => s.duration).length}</span>
          </div>
          {latestSeizure && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Episode</span>
              <span className="font-semibold text-gray-900">{getTimeInfo(latestSeizure.createdAt)?.relative}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default QuickOverview
