'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'
import { setOpenWalkDrawer } from '@/app/redux/features/petSlice'
import {
  calculateTotalDistance,
  getDistanceMiles,
  getDurationMinutes,
  getPaceColor,
  getTodaysTotalDistance,
  getTodaysWalks
} from '@/app/lib/utils/walk'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import { calculateAverageMood, calculateTodaysAverageMood, getMoodData, getTimeInfo } from '@/app/lib/utils'
import { walkCreateTokenCost } from '@/app/lib/constants/token'

const Walks = () => {
  const { walks, zeroWalks } = useAppSelector((state: RootState) => state.pet)
  const todaysWalks = getTodaysWalks(walks || [])
  const todaysWalkCount = todaysWalks.length
  const dailyGoal = 6
  const hasReachedDailyGoal = todaysWalkCount >= dailyGoal
  const totalDistance = calculateTotalDistance(walks)
  const todaysTotalDistance = getTodaysTotalDistance(walks)
  const todaysAverageMood = calculateTodaysAverageMood(walks)
  const averageMood = calculateAverageMood(walks)

  if (zeroWalks) {
    return (
      <ZeroLogs
        btnText="Log walk"
        title="No walks added yet"
        subtitle="Start tracking your pet's walks to monitor their exercise routine, mood, and activity patterns."
        tokens={walkCreateTokenCost}
        func={setOpenWalkDrawer}
      />
    )
  }

  return (
    <>
      <div className="h-[calc(100dvh-96px)]">
        <div className="mx-auto px-6 space-y-8">
          {/* Header */}
          <CleanHeader btnText="Log Walk" func={setOpenWalkDrawer} tokens={15} />
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Latest Walk Highlight */}
              {walks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Latest Walk</h2>
                      <span className="text-sm text-gray-500">Most recent</span>
                    </div>

                    {(() => {
                      const latest = walks[0]
                      const moodData = getMoodData(latest?.moodRating || 0)
                      const MoodIcon = moodData.icon
                      const latestMiles = getDistanceMiles(latest.distance)
                      const latestDuration = getDurationMinutes(latest.duration)

                      return (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{latest?.pet?.name}</h3>
                            <p className="text-sm text-gray-500">{getTimeInfo(latest?.createdAt)?.relative}</p>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{latestMiles}</div>
                              <div className="text-sm text-gray-500">miles</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{latestDuration}:00</div>
                              <div className="text-sm text-gray-500">duration</div>
                            </div>
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${moodData.color}`}>
                              <MoodIcon className="w-4 h-4" />
                              <span className="font-medium">{latest?.moodRating}/4</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </motion.div>
              )}

              {/* All Walks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {walks.map((walk, index) => {
                  const moodData = getMoodData(walk?.moodRating || 0)
                  const MoodIcon = moodData.icon
                  const paceColor = getPaceColor(walk?.pace || '')
                  const currentDistance = getDistanceMiles(walk.distance)
                  const currentDuration = getDurationMinutes(walk.duration)

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:scale-105"
                    >
                      {/* Pet Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">
                              {walk?.pet?.type === 'DOG' ? 'D' : 'C'}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{walk?.pet?.name}</span>
                        </div>
                        <MoodIcon className={`w-5 h-5 ${moodData.iconColor}`} />
                      </div>

                      {/* Walk Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Distance</span>
                          <span className="font-semibold text-gray-900">{currentDistance} miles</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Duration</span>
                          <span className="font-semibold text-gray-900">{currentDuration}:00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Mood</span>
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${moodData.color}`}
                          >
                            <span>{walk?.moodRating}/4</span>
                          </div>
                        </div>
                      </div>

                      {/* Pace and Distraction */}
                      <div className="space-y-2 mb-4">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paceColor}`}
                        >
                          {walk?.pace}
                        </div>
                        {walk?.distraction && (
                          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            Distraction: {walk.distraction}
                          </div>
                        )}
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeInfo(walk?.createdAt)?.relative}</span>
                      </div>

                      {/* Notes if available */}
                      {walk?.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">
                          &quot;{walk.notes}&quot;
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Quick Overview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
                <div className="space-y-4">
                  {/* Today's Stats Section */}
                  {todaysWalks.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Today&apos;s Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Walks Today</span>
                          <span className="font-semibold text-blue-900">
                            {todaysWalkCount}/{dailyGoal}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Distance Today</span>
                          <span className="font-semibold text-blue-900">{todaysTotalDistance.toFixed(1)} miles</span>
                        </div>
                        {todaysAverageMood && (
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-700">Today&apos;s Mood</span>
                            <span className="font-semibold text-blue-900">{todaysAverageMood}/4</span>
                          </div>
                        )}
                        {/* Progress Bar */}
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              hasReachedDailyGoal
                                ? 'bg-red-500'
                                : todaysWalkCount >= 4
                                  ? 'bg-yellow-500'
                                  : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min((todaysWalkCount / dailyGoal) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          {hasReachedDailyGoal
                            ? 'Daily limit reached'
                            : `${dailyGoal - todaysWalkCount} more walks to go`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overall Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Walks</span>
                      <span className="font-semibold text-gray-900">{walks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Distance</span>
                      <span className="font-semibold text-gray-900">{totalDistance.toFixed(1)} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Mood</span>
                      <span className="font-semibold text-gray-900">{averageMood}/4</span>
                    </div>
                    {walks.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Walk</span>
                        <span className="font-semibold text-gray-900">
                          {getTimeInfo(walks[0]?.createdAt)?.relative}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {walks.slice(0, 8).map((walk, index) => {
                    const moodData = getMoodData(walk?.moodRating || 0)

                    return (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{walk?.pet?.name}</div>
                            <div className="text-xs text-gray-500">{getTimeInfo(walk?.createdAt)?.relative}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{walk?.distance}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${moodData.color}`}>
                              {walk?.moodRating}/4
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Walks
