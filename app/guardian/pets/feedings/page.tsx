'use client'

import React from 'react'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import { RootState, useAppSelector } from '@/app/redux/store'
import { motion } from 'framer-motion'
import { feedingCreateTokenCost } from '@/app/lib/constants/public/token'
import FeedingCard from '@/app/components/guardian/feeding/FeedingCard'
import LatestFeeding from '@/app/components/guardian/feeding/LatestFeeding'
import { getFoodTypeConfig, getTimeInfo } from '@/app/lib/utils'
import { setOpenFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'

const Feedings = () => {
  const { zeroFeedings, feedings } = useAppSelector((state: RootState) => state.feeding)

  const shouldAnimate = useInitialAnimation(feedings)

  if (zeroFeedings) {
    return (
      <ZeroLogs
        btnText="Log feeding"
        title="No feedings logged yet"
        subtitle="Keep your pets healthy with consistent feeding logs"
        tokens={feedingCreateTokenCost}
        func={setOpenFeedingDrawer}
        formName="feedingForm"
      />
    )
  }

  return (
    <div className="h-[calc(100dvh-96px)]">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader
          btnText="Log Feeding"
          func={setOpenFeedingDrawer}
          tokens={feedingCreateTokenCost}
          formName="feedingForm"
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Latest Feeding Highlight */}
            <LatestFeeding feeding={feedings[0]} />

            {/* All Feedings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedings?.map((feeding, i) => (
                <FeedingCard key={feeding.id} feeding={feeding} index={i} shouldAnimate={shouldAnimate} />
              ))}
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

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Feedings</span>
                    <span className="font-semibold text-gray-900">{feedings.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Food Given</span>
                    <span className="font-semibold text-gray-900">
                      {feedings.length > 0
                        ? feedings
                            .reduce((sum, feeding) => {
                              // Handle fraction strings like '1/2'
                              const amount = feeding.foodAmount.includes('/')
                                ? eval(feeding.foodAmount)
                                : parseFloat(feeding.foodAmount || '0')
                              return sum + amount
                            }, 0)
                            .toFixed(1)
                        : '0.0'}{' '}
                      cups
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Wet Food</span>
                      <div className="text-right">
                        <span className="font-semibold text-blue-600">
                          {feedings.filter((f) => f.foodType === 'wet').length} feedings
                        </span>
                        <div className="text-xs text-gray-500">
                          {feedings
                            .filter((f) => f.foodType === 'wet')
                            .reduce((sum, f) => sum + parseFloat(f.foodAmount || '0'), 0)
                            .toFixed(1)}{' '}
                          cups
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dry Food</span>
                      <div className="text-right">
                        <span className="font-semibold text-amber-600">
                          {feedings.filter((f) => f.foodType === 'dry').length} feedings
                        </span>
                        <div className="text-xs text-gray-500">
                          {feedings
                            .filter((f) => f.foodType === 'dry')
                            .reduce((sum, f) => sum + parseFloat(f.foodAmount || '0'), 0)
                            .toFixed(1)}{' '}
                          cups
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mixed Food</span>
                      <div className="text-right">
                        <span className="font-semibold text-green-600">
                          {feedings.filter((f) => f.foodType === 'wet_dry').length} feedings
                        </span>
                        <div className="text-xs text-gray-500">
                          {feedings
                            .filter((f) => f.foodType === 'wet_dry')
                            .reduce((sum, f) => sum + parseFloat(f.foodAmount || '0'), 0)
                            .toFixed(1)}{' '}
                          cups
                        </div>
                      </div>
                    </div>
                  </div>

                  {feedings.length > 0 && (
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Last Feeding</span>
                      <span className="font-semibold text-gray-900">
                        {getTimeInfo(new Date(feedings[0]?.timeRecorded))?.relative}
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
                <h3 className="text-lg font-semibold text-gray-800">Recent Feedings</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {feedings.map((feeding, index) => {
                  const foodTypeData = getFoodTypeConfig(feeding?.foodType || '')

                  return (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{feeding?.pet?.name}</div>
                          <div className="text-xs text-gray-500">
                            {getTimeInfo(new Date(feeding?.timeRecorded))?.relative}
                          </div>
                          {feeding?.notes && (
                            <div className="text-xs text-gray-400 mt-1 truncate max-w-32">
                              &quot;{feeding.notes}&quot;
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{feeding?.foodAmount}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${foodTypeData.badge}`}>
                            {feeding.foodType}
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
  )
}

export default Feedings
