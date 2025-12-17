import { FC } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { ISeizure } from '@/app/types'
import { formatDuration, getTimeInfo } from '@/app/lib/utils'

interface IAlertForRecentActivity {
  todaysSeizures: ISeizure[]
  todaysSeizuresCount: number
}

const AlertForRecentActivity: FC<IAlertForRecentActivity> = ({ todaysSeizures, todaysSeizuresCount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-red-800 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>Seizure Activity Today</span>
        </h2>
        <span className="text-sm text-red-600 self-start sm:self-center">
          {todaysSeizuresCount} episode{todaysSeizuresCount > 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {todaysSeizures.map((seizure) => (
          <div key={seizure.id} className="bg-white rounded-lg p-3 sm:p-4 border border-red-200">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{seizure.pet?.name}</h3>
                <p className="text-sm text-gray-600">{getTimeInfo(new Date(seizure.timeRecorded))?.time}</p>
                {seizure.duration && (
                  <p className="text-sm text-red-600">Duration: {formatDuration(seizure.duration)}</p>
                )}
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                {seizure.videoUrl && <div className="text-xs text-blue-600 whitespace-nowrap">📹 Video recorded</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default AlertForRecentActivity
