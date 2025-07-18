import { getDaysRemaining, getFrequencyDisplay, getMedicationStatus } from '@/app/lib/utils'
import { IMedication } from '@/app/types'
import { motion } from 'framer-motion'
import { Pill } from 'lucide-react'

interface MedicationCardProps {
  medication: IMedication
  index: number
  status: ReturnType<typeof getMedicationStatus>
  StatusIcon: React.ComponentType<any>
  showExpired?: boolean
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  index,
  status,
  StatusIcon,
  showExpired = false
}) => {
  const daysRemaining = getDaysRemaining(medication)
  const isExpired = status.label === 'Expired'

  if (isExpired && !showExpired) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Pill className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{medication.drugName}</h3>
              <p className="text-xs text-gray-500">{medication.pet?.name}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="font-medium">{status.label}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          {/* Dosage */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dosage</span>
            <span className="font-medium text-gray-900">
              {medication.dosage} {medication.dosageUnit}
            </span>
          </div>

          {/* Frequency */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Frequency</span>
            <span className="font-medium text-gray-900">
              {getFrequencyDisplay(medication.frequency, medication.customFrequency)}
            </span>
          </div>

          {/* Treatment Period */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Started</span>
            <div className="text-right">
              <div className="text-sm text-gray-900">{new Date(medication.startDate).toLocaleDateString()}</div>
              {daysRemaining !== null && <div className="text-xs text-blue-600">{daysRemaining} days remaining</div>}
            </div>
          </div>

          {/* Reminder Times */}
          {medication.reminderEnabled && medication.reminderTimes.length > 0 && (
            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-600">Reminders</span>
              <div className="text-right">
                <div className="flex flex-wrap gap-1 justify-end">
                  {medication.reminderTimes.slice(0, 3).map((time, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {time}
                    </span>
                  ))}
                  {medication.reminderTimes.length > 3 && (
                    <span className="text-xs text-gray-500">+{medication.reminderTimes.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prescribed By */}
          {medication.prescribedBy && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prescribed by</span>
              <span className="text-sm text-gray-900">{medication.prescribedBy}</span>
            </div>
          )}

          {/* Instructions */}
          {medication.instructions && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Instructions:</p>
              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">{medication.instructions}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-xs ${status.bgColor} ${status.textColor}`}>
              {status.description}
            </div>
            <div className="flex space-x-2">
              <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
