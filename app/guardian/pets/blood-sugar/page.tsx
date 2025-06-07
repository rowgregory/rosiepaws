'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Droplets, Plus } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setOpenBloodSugarDrawer } from '@/app/redux/features/petSlice'
import { formatTime } from '@/app/lib/utils/date'
import { getBloodSugarRange, getTodaysBloodSugarLogs } from '@/app/forms/blood-sugar-form'

const BloodSugar = () => {
  const { bloodSugars } = useAppSelector((state: RootState) => state.pet)
  const dispatch = useAppDispatch()
  const displayData = bloodSugars

  // Get today's blood sugar logs
  const todaysLogs = getTodaysBloodSugarLogs(bloodSugars || [])
  const todaysLogCount = todaysLogs.length
  const dailyLimit = 4
  const hasReachedDailyLimit = todaysLogCount >= dailyLimit

  // Get recent readings for quick stats (all readings, not just today's)
  const recentReadings = displayData?.slice(0, 3)
  const averageValue =
    displayData.length > 0
      ? Math.round(displayData?.reduce((sum, reading) => sum + parseInt(reading?.value), 0) / displayData?.length)
      : 0

  // Get today's average if there are readings today
  const todaysAverageValue =
    todaysLogs.length > 0
      ? Math.round(todaysLogs.reduce((sum, reading) => sum + parseInt(reading?.value), 0) / todaysLogs.length)
      : null

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blood Sugar Monitor</h1>
                    <p className="text-gray-600 mt-1">Track your pets&apos; glucose levels</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Quick Stats */}
                  {displayData.length > 0 && (
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{displayData.length}</div>
                        <div className="text-sm text-gray-500">Total Readings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{averageValue}</div>
                        <div className="text-sm text-gray-500">Average mg/dL</div>
                      </div>
                    </div>
                  )}

                  {/* Add Reading Button */}
                  <motion.button
                    onClick={() => {
                      // Check daily limit before opening drawer
                      if (!hasReachedDailyLimit) {
                        dispatch(setOpenBloodSugarDrawer())
                      }
                    }}
                    className={`group flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                      hasReachedDailyLimit
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:scale-105'
                    }`}
                    whileHover={!hasReachedDailyLimit ? { scale: 1.05 } : {}}
                    whileTap={!hasReachedDailyLimit ? { scale: 0.95 } : {}}
                    disabled={hasReachedDailyLimit}
                  >
                    <Plus
                      className={`w-5 h-5 ${
                        hasReachedDailyLimit ? '' : 'group-hover:rotate-90'
                      } transition-transform duration-300`}
                    />
                    <span>{hasReachedDailyLimit ? 'Daily Limit Reached' : 'Add Blood Sugar'}</span>
                    {hasReachedDailyLimit && (
                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {todaysLogCount}/{dailyLimit}
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {displayData.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Droplets className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No readings yet</h3>
              <p className="text-gray-500 mb-6">Blood sugar readings will appear here once you start tracking.</p>
              <motion.button
                onClick={() => dispatch(setOpenBloodSugarDrawer())}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Blood Sugar Reading</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Main Content */
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Recent Readings Cards */}
              <div className="xl:col-span-3 space-y-6">
                {/* Latest Reading Highlight */}
                {recentReadings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Latest Reading</h2>
                        <span className="text-sm text-gray-500">Most recent</span>
                      </div>

                      {(() => {
                        const latest = recentReadings[0]
                        const range = getBloodSugarRange(latest?.value)
                        const timeData = formatTime(latest?.timeTaken)
                        const IconComponent = range.icon

                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-gray-600">
                                  {latest?.pet.type === 'DOG' ? 'DOG' : 'CAT'}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{latest?.pet.name}</h3>
                                <p className="text-sm text-gray-500">{timeData.relative}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-3xl font-bold text-gray-900">{latest?.value}</div>
                                <div className="text-sm text-gray-500">mg/dL</div>
                              </div>
                              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${range.color}`}>
                                <IconComponent className="w-4 h-4" />
                                <span className="font-medium">{range.label}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </motion.div>
                )}

                {/* All Readings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayData.map((reading, index) => {
                    const range = getBloodSugarRange(reading?.value)
                    const timeData = formatTime(reading?.timeTaken)
                    const IconComponent = range.icon

                    return (
                      <motion.div
                        key={reading?.id}
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
                                {reading?.pet.type === 'DOG' ? 'D' : 'C'}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{reading?.pet.name}</span>
                          </div>
                          <IconComponent className={`w-5 h-5 ${range.color.split(' ')[2]}`} />
                        </div>

                        {/* Blood Sugar Value */}
                        <div className="text-center mb-4">
                          <motion.div
                            className="text-3xl font-bold text-gray-900"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                          >
                            {reading?.value}
                            <span className="text-sm text-gray-500 ml-1">mg/dL</span>
                          </motion.div>
                          <div
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${range.color}`}
                          >
                            <span>{range.label}</span>
                          </div>
                        </div>

                        {/* Time Info */}
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {timeData.date} • {timeData.time}
                          </span>
                        </div>
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
                    {todaysLogs.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Today&apos;s Activity</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-700">Readings Today</span>
                            <span className="font-semibold text-blue-900">
                              {todaysLogCount}/{dailyLimit}
                            </span>
                          </div>
                          {todaysAverageValue && (
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-700">Today&apos;s Average</span>
                              <span className="font-semibold text-blue-900">{todaysAverageValue} mg/dL</span>
                            </div>
                          )}
                          {/* Progress Bar */}
                          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                hasReachedDailyLimit
                                  ? 'bg-red-500'
                                  : todaysLogCount >= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((todaysLogCount / dailyLimit) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            {hasReachedDailyLimit
                              ? 'Daily limit reached'
                              : `${dailyLimit - todaysLogCount} more logs available`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Overall Stats */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Readings</span>
                        <span className="font-semibold text-gray-900">{displayData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overall Average</span>
                        <span className="font-semibold text-gray-900">{averageValue} mg/dL</span>
                      </div>
                      {displayData.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Reading</span>
                          <span className="font-semibold text-gray-900">
                            {formatTime(displayData[0]?.timeTaken)?.relative}
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
                    {displayData.slice(0, 8).map((reading) => {
                      const range = getBloodSugarRange(reading?.value)
                      const timeData = formatTime(reading?.timeTaken)

                      return (
                        <div key={reading?.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{reading?.pet.name}</div>
                              <div className="text-xs text-gray-500">{timeData.relative}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{reading?.value}</div>
                              <div className={`text-xs px-2 py-1 rounded-full ${range.color}`}>{range.label}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default BloodSugar
