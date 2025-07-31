import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { PainScore } from '@/app/types'
import { getPainConfig } from '@/app/lib/constants'
import { getTimeInfo } from '@/app/lib/utils'

const LatestPainScore: FC<{ painScore: PainScore }> = ({ painScore }) => {
  const latest = painScore
  const scoreData = getPainConfig(latest?.score || 0)
  const ScoreIcon = scoreData.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Latest Pain Score</h2>
          <span className="text-sm text-gray-500">Most recent</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{latest?.pet?.name}</h3>
            <p className="text-sm text-gray-500">{getTimeInfo(latest?.createdAt)?.relative}</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${scoreData.color}`}>
              <ScoreIcon className="w-4 h-4" />
              <span className="font-medium">{latest?.score}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LatestPainScore
