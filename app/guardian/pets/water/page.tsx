'use client'

import React from 'react'
import { Droplets, Plus, Clock } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { motion } from 'framer-motion'
import { setOpenWaterDrawer } from '@/app/redux/features/petSlice'
import GuardianPageHeader from '@/app/components/guardian/GuardianPageHeader'
import {
  formatTimeAgo,
  getIntakeTypeColor,
  getMoodEmoji,
  getRelativeIcon,
  getTodaysLogs
} from '@/app/utils/water-helpers'

const WaterLogsPage = () => {
  const { waters, zeroWaters } = useAppSelector((state: RootState) => state.pet)
  const dispatch = useAppDispatch()

  return (
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <GuardianPageHeader
          Icon={Droplets}
          data={waters}
          title="Water Intake Logs"
          subtitle="Track your pets' hydration levels"
          setOpenDrawer={setOpenWaterDrawer}
          btnText="Water Intake"
          overlayGradient="bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
          iconGradient="bg-gradient-to-br from-blue-500 to-cyan-500"
          buttonGradient="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        />

        {zeroWaters ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Droplets className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Start tracking water intake</h3>
            <p className="text-gray-500 mb-6">Keep your pets healthy with consistent hydration logs</p>
            <motion.button
              onClick={() => dispatch(setOpenWaterDrawer())}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Water Intake</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {waters?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Latest Water Log</h2>
                      <span className="text-sm text-gray-500">Most recent</span>
                    </div>

                    {(() => {
                      const latest = waters[0]
                      const moodEmoji = getMoodEmoji(latest?.moodRating)

                      return (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">{latest?.pet?.type === 'DOG' ? '🐶' : '🐈'}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{latest?.pet?.name}</h3>
                              <p className="text-sm text-gray-500">{formatTimeAgo(latest?.createdAt)}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              {latest?.intakeType === 'milliliters' ? (
                                <>
                                  <div className="text-3xl font-bold text-gray-900">{latest?.milliliters}</div>
                                  <div className="text-sm text-gray-500">mL</div>
                                </>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  {getRelativeIcon(latest?.relativeIntake)}
                                  <div className="text-xl font-bold text-gray-900 capitalize">
                                    {latest?.relativeIntake}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="text-lg">{moodEmoji}</span>
                              <span className="font-medium">{latest?.moodRating}/4</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </motion.div>
              )}
              {/* All logs grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {waters?.map((log) => {
                  const moodEmoji = getMoodEmoji(log?.moodRating)

                  return (
                    <div
                      key={log?.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:scale-105"
                    >
                      {/* Pet Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs">{log?.pet?.type === 'DOG' ? '🐶' : '🐈'}</span>
                          </div>
                          <span className="font-medium text-gray-900">{log?.pet?.name}</span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getIntakeTypeColor(
                            log?.intakeType
                          )}`}
                        >
                          {log?.intakeType === 'milliliters' ? 'Exact' : 'Relative'}
                        </span>
                      </div>

                      {/* Water Intake Value */}
                      <div className="text-center mb-4">
                        {log?.intakeType === 'milliliters' ? (
                          <div className="text-3xl font-bold text-gray-900">
                            {log?.milliliters}
                            <span className="text-sm text-gray-500 ml-1">mL</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            {getRelativeIcon(log?.relativeIntake)}
                            <div className="text-2xl font-bold text-gray-900 capitalize">{log?.relativeIntake}</div>
                          </div>
                        )}

                        <div className="flex items-center justify-center space-x-1 px-3 py-1 rounded-full text-xs font-medium mt-2 bg-blue-50 text-blue-700">
                          <span>{moodEmoji}</span>
                          <span>{log?.moodRating}/4 willingness</span>
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(log?.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} •{' '}
                          {new Date(log?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Notes */}
                      {log?.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-600 italic">&quot;{log?.notes}&quot;</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
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
                  {getTodaysLogs(waters) > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Today&apos;s Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Logs Today</span>
                          <span className="font-semibold text-blue-900">{getTodaysLogs(waters)}</span>
                        </div>
                        {/* Progress visualization */}
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${Math.min((getTodaysLogs(waters) / 6) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          {getTodaysLogs(waters) >= 6
                            ? 'Great tracking today!'
                            : `${6 - getTodaysLogs(waters)} more logs recommended`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overall Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Logs</span>
                      <span className="font-semibold text-gray-900">{waters?.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Exact Measurements</span>
                      <span className="font-semibold text-gray-900">
                        {waters?.filter((log) => log?.intakeType === 'milliliters').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Relative Measurements</span>
                      <span className="font-semibold text-gray-900">
                        {waters?.filter((log) => log?.intakeType === 'relative').length}
                      </span>
                    </div>
                    {waters?.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Log</span>
                        <span className="font-semibold text-gray-900">{formatTimeAgo(waters[0]?.createdAt)}</span>
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
                  {waters?.slice(0, 8).map((log) => {
                    const moodEmoji = getMoodEmoji(log?.moodRating)

                    return (
                      <div key={log?.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{log?.pet?.name}</div>
                            <div className="text-xs text-gray-500">{formatTimeAgo(log?.createdAt)}</div>
                          </div>
                          <div className="text-right">
                            {log?.intakeType === 'milliliters' ? (
                              <div className="font-bold text-gray-900">{log?.milliliters} mL</div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                {getRelativeIcon(log?.relativeIntake)}
                                <span className="font-bold text-gray-900 capitalize">{log?.relativeIntake}</span>
                              </div>
                            )}
                            <div className="text-xs text-blue-600">
                              {moodEmoji} {log?.moodRating}/4
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
        )}
      </div>
    </div>
  )
}

export default WaterLogsPage
