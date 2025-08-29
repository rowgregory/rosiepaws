'use client'

import CleanHeader from '@/app/components/guardian/CleanHeader'
import WaterCard from '@/app/components/guardian/water/WaterCard'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'
import { waterCreateTokenCost } from '@/app/lib/constants/public/token'
import {
  determineRelativeIntake,
  getIntakeData,
  getTimeInfo,
  getTodaysWaterLogs,
  getWaterIntakeConfig
} from '@/app/lib/utils'
import { setOpenWaterDrawer } from '@/app/redux/features/waterSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import { IWater } from '@/app/types'
import { motion } from 'framer-motion'

const Water = () => {
  const { zeroWaters, waters } = useAppSelector((state: RootState) => state.water)

  const todaysWaterLogs = getTodaysWaterLogs(waters || [])
  const todaysWaterLogsCount = todaysWaterLogs?.length
  const totalWaterIntake = todaysWaterLogs.reduce((sum, log) => sum + parseInt(log.milliliters), 0)
  const averageMoodRating =
    todaysWaterLogsCount > 0
      ? (todaysWaterLogs.reduce((sum, log) => sum + parseInt(log.moodRating), 0) / todaysWaterLogsCount).toFixed(1)
      : '0.0'

  const shouldAnimate = useInitialAnimation(waters)

  if (zeroWaters) {
    return (
      <ZeroLogs
        btnText="Add water"
        title="No water logged yet"
        subtitle="Track your pet's daily water consumption to ensure proper hydration and health."
        tokens={waterCreateTokenCost}
        func={setOpenWaterDrawer}
        formName="waterForm"
      />
    )
  }

  return (
    <div className="h-[calc(100dvh-96px)]">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader btnText="Log Water" func={setOpenWaterDrawer} tokens={waterCreateTokenCost} formName="waterForm" />
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Latest Water Log Highlight */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Latest Water Log</h2>
                  <span className="text-sm text-gray-500 self-start sm:self-center">Most recent</span>
                </div>

                {(() => {
                  const latest = waters[0]
                  const previous = waters[1] // Get the second most recent entry

                  const relativeIntakeStatus = determineRelativeIntake(
                    parseInt(latest?.milliliters) || 0,
                    parseInt(previous?.milliliters) || null
                  )

                  const intakeData = getWaterIntakeConfig(relativeIntakeStatus)
                  const IntakeIcon = intakeData.icon

                  return (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{latest?.pet?.name}</h3>
                        <p className="text-sm text-gray-500">{getTimeInfo(latest?.createdAt)?.relative}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                        <div className="text-left sm:text-right">
                          <div className="text-2xl font-bold text-blue-600">{latest?.milliliters}ml</div>
                          <div className="text-sm text-gray-500">{latest?.intakeType}</div>
                        </div>
                        <div
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${intakeData.color} self-start sm:self-center whitespace-nowrap`}
                        >
                          <IntakeIcon className="w-4 h-4" />
                          <span className="font-medium capitalize">{relativeIntakeStatus}</span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>

            {/* All Water Logs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waters?.map((water: IWater, index: number) => {
                return <WaterCard key={water.id} water={water} index={index} shouldAnimate={shouldAnimate} />
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
                {todaysWaterLogsCount > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Today&apos;s Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Water Logs Today</span>
                        <span className="font-semibold text-blue-900">{todaysWaterLogsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Total Water Intake</span>
                        <span className="font-semibold text-blue-900">{totalWaterIntake}ml</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Average Mood</span>
                        <span className="font-semibold text-blue-900">{averageMoodRating}/4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Latest Intake</span>
                        <span
                          className={`font-semibold ${(() => {
                            const latest = todaysWaterLogs[0]
                            const previous = todaysWaterLogs[1]

                            const relativeIntakeStatus = determineRelativeIntake(
                              parseInt(latest?.milliliters) || 0,
                              parseInt(previous?.milliliters) || null
                            )

                            return relativeIntakeStatus === 'more'
                              ? 'text-blue-600'
                              : relativeIntakeStatus === 'less'
                                ? 'text-red-600'
                                : 'text-green-600'
                          })()}`}
                        >
                          {todaysWaterLogs[todaysWaterLogsCount - 1]?.milliliters}ml
                        </span>
                      </div>
                      {/* Water Intake Trend Indicator */}
                      {todaysWaterLogsCount >= 2 && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                          <span className="text-sm text-blue-700">Intake Trend</span>
                          <div className="flex items-center">
                            {(() => {
                              const latestLog = todaysWaterLogs[0]
                              const previousLog = todaysWaterLogs[1]

                              // Handle milliliters comparison
                              if (
                                latestLog?.milliliters &&
                                previousLog?.milliliters &&
                                !isNaN(parseInt(latestLog.milliliters)) &&
                                !isNaN(parseInt(previousLog.milliliters))
                              ) {
                                const latest = parseInt(latestLog.milliliters)
                                const previous = parseInt(previousLog.milliliters)
                                const trend = latest - previous

                                if (trend > 0) {
                                  return (
                                    <span className="text-blue-600 text-sm font-semibold flex items-center">
                                      ↗ Increasing
                                    </span>
                                  )
                                } else if (trend < 0) {
                                  return (
                                    <span className="text-orange-600 text-sm font-semibold flex items-center">
                                      ↘ Decreasing
                                    </span>
                                  )
                                } else {
                                  return (
                                    <span className="text-green-600 text-sm font-semibold flex items-center">
                                      → Stable
                                    </span>
                                  )
                                }
                              }

                              const latestRelative = determineRelativeIntake(
                                parseInt(latestLog?.milliliters) || 0,
                                parseInt(previousLog?.milliliters) || null
                              )

                              const previousRelative = determineRelativeIntake(
                                parseInt(previousLog?.milliliters) || 0,
                                parseInt(todaysWaterLogs[todaysWaterLogsCount - 3]?.milliliters) || null
                              )

                              const getRelativeValue = (intake: string) => {
                                if (intake === 'more') return 1
                                if (intake === 'less') return -1
                                return 0
                              }

                              const latestValue = getRelativeValue(latestRelative)
                              const previousValue = getRelativeValue(previousRelative)
                              const trend = latestValue - previousValue

                              if (trend > 0) {
                                return (
                                  <span className="text-blue-600 text-sm font-semibold flex items-center">↗ More</span>
                                )
                              } else if (trend < 0) {
                                return (
                                  <span className="text-orange-600 text-sm font-semibold flex items-center">
                                    ↘ Less
                                  </span>
                                )
                              } else {
                                return (
                                  <span className="text-green-600 text-sm font-semibold flex items-center">
                                    → Similar
                                  </span>
                                )
                              }
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Overall Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Water Logs</span>
                    <span className="font-semibold text-gray-900">{waters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Daily Intake</span>
                    <span className="font-semibold text-gray-900">
                      {(() => {
                        const logsWithMl = waters.filter((log) => log.milliliters && !isNaN(parseInt(log.milliliters)))
                        if (logsWithMl.length > 0) {
                          const avgMl =
                            logsWithMl.reduce((sum, log) => sum + parseInt(log.milliliters), 0) / logsWithMl.length
                          return `${avgMl.toFixed(0)}ml`
                        }
                        return 'Relative tracking'
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest Intake</span>
                    <span className="font-semibold text-blue-600">
                      {(() => {
                        const logsWithMl = waters.filter((log) => log.milliliters && !isNaN(parseInt(log.milliliters)))
                        return logsWithMl.length > 0
                          ? `${Math.max(...logsWithMl.map((log) => parseInt(log.milliliters)))}ml`
                          : 'N/A'
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest Intake</span>
                    <span className="font-semibold text-orange-600">
                      {(() => {
                        const logsWithMl = waters.filter((log) => log.milliliters && !isNaN(parseInt(log.milliliters)))
                        return logsWithMl.length > 0
                          ? `${Math.min(...logsWithMl.map((log) => parseInt(log.milliliters)))}ml`
                          : 'N/A'
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Mood</span>
                    <span className="font-semibold text-gray-900">
                      {waters.length > 0
                        ? (waters.reduce((sum, log) => sum + parseInt(log.moodRating), 0) / waters.length).toFixed(1)
                        : '0.0'}
                      /4
                    </span>
                  </div>
                  {waters.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Water Log</span>
                      <span className="font-semibold text-gray-900">
                        {getTimeInfo(new Date(waters[0]?.timeRecorded))?.relative}
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
                <h3 className="text-lg font-semibold text-gray-800">Recent Water Logs</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {waters.slice(0, 8).map((waterLog, index) => {
                  // Calculate relative intake by comparing with previous entry
                  const previousWaterLog = waters[index + 1] // Next item in the array (previous chronologically)
                  const relativeIntakeStatus = determineRelativeIntake(
                    parseInt(waterLog?.milliliters) || 0,
                    parseInt(previousWaterLog?.milliliters) || null
                  )

                  const intakeData = getIntakeData(relativeIntakeStatus)
                  const moodRating = parseInt(waterLog?.moodRating || '0')

                  return (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{waterLog?.pet?.name}</div>
                          <div className="text-xs text-gray-500">
                            {getTimeInfo(new Date(waterLog?.timeRecorded))?.relative}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {waterLog?.intakeType} • Mood: {moodRating}/5
                          </div>
                          {waterLog?.notes && (
                            <div className="text-xs text-gray-400 mt-1 truncate max-w-32">
                              &quot;{waterLog.notes}&quot;
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {waterLog?.milliliters && !isNaN(parseInt(waterLog.milliliters))
                              ? `${waterLog.milliliters}ml`
                              : relativeIntakeStatus}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${intakeData.color}`}>{intakeData.label}</div>
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
  )
}

export default Water
