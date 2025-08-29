'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PainScore } from '@/app/types/entities'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import CleanHeader from '@/app/components/guardian/CleanHeader'
import PainScoreCard from '@/app/components/guardian/pain/PainScoreCard'
import { getAveragePainScore, getTimeInfo, getTodaysPainScores } from '@/app/lib/utils'
import { getPainConfig } from '@/app/lib/constants'
import { painScoreCreateTokenCost } from '@/app/lib/constants/public/token'
import { setOpenPainDrawer } from '@/app/redux/features/painSlice'
import LatestPainScore from '@/app/components/guardian/pain/LatestPainScore'
import { RootState, useAppSelector } from '@/app/redux/store'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'

const PainScoring = () => {
  const { painScores, zeroPainScores } = useAppSelector((state: RootState) => state.painScore)

  const todaysPainScores = getTodaysPainScores(painScores || [])
  const todaysPainScoresCount = todaysPainScores?.length
  const averagePainScore = getAveragePainScore(todaysPainScores, todaysPainScoresCount)

  const shouldAnimate = useInitialAnimation(painScores)

  if (zeroPainScores) {
    return (
      <ZeroLogs
        btnText="Log pain score"
        title="No pain scores logged yet"
        subtitle="Monitor and track your pet's pain levels to ensure their comfort and wellbeing."
        tokens={painScoreCreateTokenCost}
        func={setOpenPainDrawer}
        formName="painForm"
      />
    )
  }

  return (
    <div className="min-h-[calc(100dvh-64px)] pb-20">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader
          btnText="Log Pain Score"
          func={setOpenPainDrawer}
          tokens={painScoreCreateTokenCost}
          formName="painForm"
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Latest Pain Score Highlight */}
            <LatestPainScore painScore={painScores?.[0]} />

            {/* All Pain Scores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {painScores?.map((painScore: PainScore, index: number) => {
                const config = getPainConfig(painScore?.score)
                const IconComponent = config.icon

                return (
                  <PainScoreCard
                    key={painScore.id}
                    painScore={painScore}
                    index={index}
                    config={config}
                    IconComponent={IconComponent}
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
                {/* Today's Stats Section */}

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Today&apos;s Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Pain Scores Today</span>
                      <span className="font-semibold text-blue-900">{todaysPainScoresCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Average Pain Score</span>
                      <span className="font-semibold text-blue-900">{averagePainScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Latest Pain Score</span>
                      <span
                        className={`font-semibold ${
                          todaysPainScores[0]?.score >= 3
                            ? 'text-red-600'
                            : todaysPainScores[0]?.score >= 2
                              ? 'text-yellow-600'
                              : 'text-green-600'
                        }`}
                      >
                        {todaysPainScores[0]?.score}/4
                      </span>
                    </div>

                    {/* Pain Score Trend Indicator */}
                    {todaysPainScoresCount >= 2 && (
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                        <span className="text-sm text-blue-700">Pain Trend</span>
                        <div className="flex items-center">
                          {(() => {
                            const latest = todaysPainScores[0]?.score
                            const previous = todaysPainScores[1]?.score
                            const trend = latest - previous

                            if (trend > 0) {
                              return (
                                <span className="text-red-600 text-sm font-semibold flex items-center">
                                  ↗ Increasing
                                </span>
                              )
                            } else if (trend < 0) {
                              return (
                                <span className="text-green-600 text-sm font-semibold flex items-center">
                                  ↘ Decreasing
                                </span>
                              )
                            } else {
                              return (
                                <span className="text-blue-600 text-sm font-semibold flex items-center">→ Stable</span>
                              )
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overall Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Pain Scores</span>
                    <span className="font-semibold text-gray-900">{painScores?.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Pain Score</span>
                    <span className="font-semibold text-gray-900">
                      {painScores?.length > 0
                        ? (painScores?.reduce((sum, score) => sum + score.score, 0) / painScores?.length).toFixed(1)
                        : '0.0'}
                      /4
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest Pain Score</span>
                    <span className="font-semibold text-red-600">
                      {painScores?.length > 0 ? Math.max(...painScores?.map((score) => score.score)) : 0}/4
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest Pain Score</span>
                    <span className="font-semibold text-green-600">
                      {painScores?.length > 0 ? Math.min(...painScores?.map((score) => score.score)) : 0}/4
                    </span>
                  </div>
                  {painScores?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Pain Score</span>
                      <span className="font-semibold text-gray-900">
                        {getTimeInfo(new Date(painScores[0]?.timeRecorded))?.relative}
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
                <h3 className="text-lg font-semibold text-gray-800">Recent Pain Scores</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {painScores?.map((painScore, index) => {
                  const getPainData = (score: number) => {
                    if (score >= 4) return { color: 'bg-red-100 text-red-800', label: 'Extreme' }
                    if (score >= 3) return { color: 'bg-orange-100 text-orange-800', label: 'Severe' }
                    if (score >= 2) return { color: 'bg-yellow-100 text-yellow-800', label: 'Moderate' }
                    if (score >= 1) return { color: 'bg-blue-100 text-blue-800', label: 'Mild' }
                    return { color: 'bg-green-100 text-green-800', label: 'None' }
                  }

                  const painData = getPainData(painScore?.score || 0)

                  return (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{painScore?.pet?.name}</div>
                          <div className="text-xs text-gray-500">
                            {getTimeInfo(new Date(painScore?.timeRecorded))?.relative}
                          </div>
                          {painScore?.notes && (
                            <div className="text-xs text-gray-400 mt-1 truncate max-w-32">
                              &quot;{painScore.notes}&quot;
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{painScore?.score}/4</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${painData.color}`}>{painData.label}</div>
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

export default PainScoring
