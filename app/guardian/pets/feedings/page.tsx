'use client'

import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import { formatTimeAgo } from '@/app/lib/utils/date'
import { setOpenFeedingDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import { Clock, Heart, TrendingUp, Utensils } from 'lucide-react'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getFoodTypeConfig } from '@/app/lib/utils/feeding'
import { getMoodEmoji } from '@/app/lib/utils'
import { feedingCreateTokenCost } from '@/app/lib/constants/token'

const Feedings = () => {
  const { zeroFeedings, feedings } = useAppSelector((state: RootState) => state.pet)

  const todaysFeedings = useMemo(() => {
    const today = new Date().toLocaleDateString()
    return feedings.filter((feeding) => {
      const feedingDate = new Date(feeding.timeRecorded || feeding.createdAt).toLocaleDateString()
      return feedingDate === today
    })
  }, [feedings])

  const lastMeal = useMemo(() => {
    if (feedings.length === 0) return 'None recorded'

    // Sort feedings by time (most recent first)
    const sortedFeedings = [...feedings].sort((a, b) => {
      const timeA = new Date(a.timeRecorded || a.createdAt).getTime()
      const timeB = new Date(b.timeRecorded || b.createdAt).getTime()
      return timeB - timeA
    })

    const latestFeeding = sortedFeedings[0]
    const lastMealTime = new Date(latestFeeding.timeRecorded || latestFeeding.createdAt)

    // Check if it's today
    const today = new Date().toLocaleDateString()
    const lastMealDate = lastMealTime.toLocaleDateString()

    if (lastMealDate === today) {
      return lastMealTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return lastMealTime.toLocaleDateString([], {
        month: 'short',
        day: 'numeric'
      })
    }
  }, [feedings])

  const weeklyFeedings = feedings.filter(
    (f) => new Date(f.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  if (zeroFeedings) {
    return (
      <ZeroLogs
        btnText="Add feeding"
        title="Record a feeding"
        subtitle="Keep your pets healthy with consistent feeding logs"
        tokens={feedingCreateTokenCost}
        func={setOpenFeedingDrawer}
      />
    )
  }

  return (
    <div className="h-[calc(100dvh-96px)]">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader btnText="Log Feeding" func={setOpenFeedingDrawer} tokens={feedingCreateTokenCost} />

        <div className="space-y-6">
          {/* Feeding Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Today&apos;s Meals</p>
                  <p className="text-2xl font-bold text-blue-900">{todaysFeedings?.length || 0}</p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Avg Excitement</p>
                  <p className="text-2xl font-bold text-green-900">
                    {feedings.length > 0
                      ? (feedings.reduce((sum, f) => sum + +f.moodRating, 0) / feedings.length).toFixed(1)
                      : '0'}
                    /4
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Last Meal</p>
                  <p className="text-lg font-bold text-purple-900">{lastMeal || 'None today'}</p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Weekly Total</p>
                  <p className="text-2xl font-bold text-amber-900">{weeklyFeedings}</p>
                </div>
                <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Food Type Breakdown */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-x-2">
              <Utensils className="text-gray-400 w-4 h-4" />
              Food Type Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(
                feedings.reduce(
                  (acc, feeding) => {
                    acc[feeding.foodType] = (acc[feeding.foodType] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>
                ) // Add type annotation here
              ).map(([type, count]) => {
                const percentage = ((count as number) / feedings.length) * 100 // Type assertion
                const config = getFoodTypeConfig(type)

                return (
                  <div key={type} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 w-24">
                      <span className="text-sm font-medium text-gray-700">{config.name}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${config.accent}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">
                      {count as number} {/* Type assertion */}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Feedings Header */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">Recent Feedings</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Showing {feedings.length} entries</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
            </div>
          </motion.div>

          {/* Feeding Cards */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            {feedings.slice(0, 5).map((feeding, index) => {
              const foodTypeConfig = getFoodTypeConfig(feeding.foodType)
              const moodEmoji = getMoodEmoji(feeding.moodRating)

              return (
                <motion.div
                  key={feeding.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${foodTypeConfig.avatarBg} rounded-lg flex items-center justify-center border ${foodTypeConfig.border}`}
                      >
                        <span className="text-lg">{feeding?.pet?.type === 'DOG' ? '🐶' : '🐱'}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{feeding?.pet?.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${foodTypeConfig.badge}`}>
                            {foodTypeConfig.icon} {foodTypeConfig.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>
                            Amount: {feeding.foodAmount} cup{+feeding?.foodAmount > 1 && 's'}
                          </span>
                          <span>
                            Mood: {moodEmoji} {feeding.moodRating}/4
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium text-gray-900">
                        {new Date(feeding.timeRecorded || feeding.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-gray-500">
                        {formatTimeAgo(new Date(feeding.timeRecorded || feeding.createdAt))}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Feedings
