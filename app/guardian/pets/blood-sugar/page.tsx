'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'
import { getBloodSugarStatus, getNextReadingSuggestion, getTimeInfo, getTodaysBloodSugarLogs } from '@/app/lib/utils'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import { IBloodSugar } from '@/app/types'
import BloodSugarCard from '@/app/components/guardian/blood-sugar/BloodSugarCard'
import { bloodSugarCreateTokenCost } from '@/app/lib/constants/public/token'
import { setOpenBloodSugarDrawer } from '@/app/redux/features/bloodSugarSlice'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'

const BloodSugar = () => {
  const { zeroBloodSugars, bloodSugars } = useAppSelector((state: RootState) => state.bloodSugar)
  const todaysBloodSugars = getTodaysBloodSugarLogs(bloodSugars || [])
  const todaysBloodSugarsCount = todaysBloodSugars?.length
  const dailyLimit = 4
  const remainingReadings = Math.max(0, dailyLimit - todaysBloodSugarsCount)
  const averageBloodSugar =
    todaysBloodSugarsCount > 0
      ? (
          todaysBloodSugars.reduce((sum, reading) => sum + parseFloat(reading.value), 0) / todaysBloodSugarsCount
        ).toFixed(1)
      : '0.0'
  const latestReading = bloodSugars?.length > 0 ? bloodSugars[0] : null
  const canAddMore = remainingReadings > 0

  const shouldAnimate = useInitialAnimation(bloodSugars)

  if (zeroBloodSugars) {
    return (
      <ZeroLogs
        btnText="Log blood sugar"
        title="No blood sugar logs yet"
        subtitle="Track your pet's blood glucose levels to monitor their health and diabetes management."
        tokens={bloodSugarCreateTokenCost}
        func={setOpenBloodSugarDrawer}
        formName="bloodSugarForm"
      />
    )
  }

  return (
    <div className="h-[calc(100dvh-96px)]">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader
          btnText={canAddMore ? 'Log Blood Sugar' : 'Daily Limit Reached'}
          func={canAddMore ? setOpenBloodSugarDrawer : null}
          tokens={bloodSugarCreateTokenCost}
          formName="bloodSugarForm"
        />

        {/* Daily Limit Warning */}
        {!canAddMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
              <div>
                <h3 className="font-semibold text-amber-800">Daily limit reached</h3>
                <p className="text-sm text-amber-700">
                  You&apos;ve recorded {dailyLimit} blood sugar readings today. You can add more tomorrow.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Latest Reading Highlight */}
            {latestReading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Latest Blood Sugar Reading</h2>
                    <span className="text-sm text-gray-500 self-start sm:self-center">Most recent</span>
                  </div>

                  {(() => {
                    const readingData = getBloodSugarStatus(parseFloat(latestReading.value))
                    const StatusIcon = readingData.icon

                    return (
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{latestReading.pet?.name}</h3>
                          <p className="text-sm text-gray-500">{getTimeInfo(latestReading.createdAt)?.relative}</p>
                          <p className="text-xs text-gray-400">
                            {getTimeInfo(new Date(latestReading.timeRecorded))?.time}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          <div className="text-left sm:text-right">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{latestReading.value}</div>
                            <div className="text-sm text-gray-500">mg/dL</div>
                          </div>
                          <div
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${readingData.color} self-start sm:self-center whitespace-nowrap`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium">{readingData.label}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </motion.div>
            )}

            {/* All Blood Sugar Readings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bloodSugars?.map((reading: IBloodSugar, index: number) => {
                const status = getBloodSugarStatus(parseFloat(reading.value))
                const StatusIcon = status.icon

                return (
                  <BloodSugarCard
                    key={reading.id}
                    reading={reading}
                    index={index}
                    status={status}
                    StatusIcon={StatusIcon}
                    shouldAnimate={shouldAnimate}
                  />
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
                {/* Daily Progress */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Today&apos;s Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Readings Today</span>
                      <span className="font-semibold text-blue-900">
                        {todaysBloodSugarsCount}/{dailyLimit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Remaining</span>
                      <span className={`font-semibold ${remainingReadings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {remainingReadings}
                      </span>
                    </div>
                    {todaysBloodSugarsCount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Average Today</span>
                        <span className="font-semibold text-blue-900">{averageBloodSugar} mg/dL</span>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-blue-700 mb-1">
                        <span>Daily Progress</span>
                        <span>{Math.round((todaysBloodSugarsCount / dailyLimit) * 100)}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            todaysBloodSugarsCount >= dailyLimit ? 'bg-red-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min((todaysBloodSugarsCount / dailyLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Next Reading Suggestion */}
                    {remainingReadings > 0 && todaysBloodSugarsCount > 0 && (
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                        <span className="text-sm text-blue-700">Suggested Next</span>
                        <span className="text-xs text-blue-600">{getNextReadingSuggestion(todaysBloodSugars)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overall Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Readings</span>
                    <span className="font-semibold text-gray-900">{bloodSugars.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average (All Time)</span>
                    <span className="font-semibold text-gray-900">
                      {bloodSugars.length > 0
                        ? (
                            bloodSugars.reduce((sum, reading) => sum + parseFloat(reading.value), 0) /
                            bloodSugars.length
                          ).toFixed(1)
                        : '0.0'}
                      {' mg/dL'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest Reading</span>
                    <span className="font-semibold text-red-600">
                      {bloodSugars.length > 0
                        ? Math.max(...bloodSugars.map((reading) => parseFloat(reading.value))).toFixed(1)
                        : '0.0'}{' '}
                      mg/dL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest Reading</span>
                    <span className="font-semibold text-green-600">
                      {bloodSugars.length > 0
                        ? Math.min(...bloodSugars.map((reading) => parseFloat(reading.value))).toFixed(1)
                        : '0.0'}{' '}
                      mg/dL
                    </span>
                  </div>
                  {latestReading && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Reading</span>
                      <span className="font-semibold text-gray-900">
                        {getTimeInfo(new Date(latestReading.timeRecorded))?.relative}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BloodSugar
