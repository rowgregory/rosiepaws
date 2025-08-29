import { IMovement } from '@/app/types'
import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { getTimeInfo } from '@/app/lib/utils'
import { Footprints } from 'lucide-react'
const LatestMovement: FC<{ movement: IMovement }> = ({ movement }) => {
  const latest = movement

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Latest Movement</h2>
          <span className="text-sm text-gray-500 self-start sm:self-center">Most recent</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{latest?.pet?.name ?? 'Rosie Paws'}</h3>
            <p className="text-sm text-gray-500">
              {latest?.createdAt ? getTimeInfo(new Date(latest?.createdAt))?.relative : 'N/A'}
            </p>
          </div>

          <div className="flex items-center self-start sm:self-center">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
              <Footprints className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700 whitespace-nowrap">{latest?.durationMinutes}mins</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LatestMovement
