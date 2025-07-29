'use client'

import React from 'react'
import { Activity, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { setOpenMovementDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import {
  getRecentMovements,
  getMovementsByType,
  getAverageActivity
} from '@/app/lib/utils/public/my-pets/movements/statUtils'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import { MovementCard } from '@/app/components/guardian/movements/MovementCard'
import { IMovement } from '@/app/types'
import { getTodaysMovements, getWeeklyMovementStats } from '@/app/lib/utils'

const MovementTracking = () => {
  const { zeroMovements, movements } = useAppSelector((state: RootState) => state.pet)
  const recentMovements = getRecentMovements(movements || [])
  const todaysMovements = getTodaysMovements(movements || [])
  const weeklyStats = getWeeklyMovementStats(movements || [])

  if (zeroMovements) {
    return (
      <ZeroLogs
        btnText="Log Movement"
        title="No movements logged yet"
        subtitle="Track your pet's mobility, exercise, and daily activities to monitor their health and progress."
        tokens={200}
        func={setOpenMovementDrawer}
      />
    )
  }

  return (
    <div className="h-[calc(100dvh-96px)]">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader btnText="Log Movement" func={setOpenMovementDrawer} tokens={200} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Today's Activity Alert */}
            {todaysMovements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-green-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Today&apos;s Activity
                  </h2>
                  <span className="text-sm text-green-600">{todaysMovements.length} sessions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {todaysMovements.slice(0, 4).map((movement, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{movement.movementType.replace('_', ' ')}</h3>
                          <p className="text-sm text-gray-600">{movement.pet?.name}</p>
                          <p className="text-sm text-green-600">
                            {movement.durationMinutes}min • {movement.activityLevel?.toLowerCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{movement.location || 'No location'}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(movement.timeRecorded).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Movements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMovements?.map((movement: IMovement, index: number) => (
                <MovementCard key={index} movement={movement} index={index} />
              ))}
            </div>

            {/* All Movements History */}
            {movements.length > recentMovements.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Movement History</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movements?.map((movement: IMovement, index: number) => (
                      <MovementCard key={index} movement={movement} index={index} showAll={true} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
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
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Sessions</span>
                    <span className="font-semibold text-gray-900">{movements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="font-semibold text-green-600">{weeklyStats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Today</span>
                    <span className="font-semibold text-blue-600">{todaysMovements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Weekly Minutes</span>
                    <span className="font-semibold text-purple-600">{weeklyStats.totalMinutes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Activity Level</span>
                    <span className="font-semibold text-orange-600">{getAverageActivity(movements)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Most Common</span>
                    <span className="font-semibold text-gray-900">
                      {getMovementsByType(movements)[0]?.type || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weekly Activity Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h3>
              <div className="space-y-3">
                {weeklyStats.dailyBreakdown?.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-12">{day.day}</span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((day.minutes / 60) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{day.minutes}m</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Recent Locations</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {movements
                  .filter((m) => m.location)
                  .slice(0, 8)
                  .map((movement, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{movement.location}</div>
                            <div className="text-xs text-gray-500">{movement.pet?.name}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {movement.movementType.replace('_', ' ')} • {movement.durationMinutes}min
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(movement.timeRecorded).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(movement.timeRecorded).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {movements.filter((m) => m.location).length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No locations recorded yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovementTracking
