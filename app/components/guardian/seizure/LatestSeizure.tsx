import { FC } from 'react'
import { motion } from 'framer-motion'
import { ISeizure } from '@/app/types'
import { formatDuration, getTimeInfo } from '@/app/lib/utils'
import { FileText, Video } from 'lucide-react'

interface ILatestSeizure {
  latestSeizure: ISeizure
}

const LatestSeizure: FC<ILatestSeizure> = ({ latestSeizure }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Latest Seizure Episode</h2>
          <span className="text-sm text-gray-500 self-start sm:self-center">Most recent</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{latestSeizure.pet?.name}</h3>
            <p className="text-sm text-gray-500">{getTimeInfo(latestSeizure.createdAt)?.relative}</p>
            <p className="text-xs text-gray-400">
              {getTimeInfo(new Date(latestSeizure.timeRecorded))?.date} at{' '}
              {getTimeInfo(new Date(latestSeizure.timeRecorded))?.time}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="text-left sm:text-right">
              {latestSeizure.duration ? (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {formatDuration(latestSeizure.duration)}
                  </div>
                  <div className="text-sm text-gray-500">Duration</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-gray-600">Duration</div>
                  <div className="text-sm text-gray-500">Not recorded</div>
                </>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {latestSeizure.videoUrl && (
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs whitespace-nowrap">
                  <Video className="w-3 h-3 flex-shrink-0" />
                  <span>Video Available</span>
                </div>
              )}
              {latestSeizure.notes && (
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs whitespace-nowrap">
                  <FileText className="w-3 h-3 flex-shrink-0" />
                  <span>Notes Added</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LatestSeizure
