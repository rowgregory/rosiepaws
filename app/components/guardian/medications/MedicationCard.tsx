import { getDaysRemaining, getFrequencyDisplay, getMedicationStatus } from '@/app/lib/utils'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { setOpenMedicationDrawer } from '@/app/redux/features/medicationSlice'
import { useDeleteMedicationMutation } from '@/app/redux/services/medicationApi'
import { useAppDispatch } from '@/app/redux/store'
import { IMedication } from '@/app/types'
import { motion } from 'framer-motion'
import { Pill, Trash2 } from 'lucide-react'

interface MedicationCardProps {
  medication: IMedication
  index: number
  status: ReturnType<typeof getMedicationStatus>
  showExpired?: boolean
  shouldAnimate: boolean
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  index,
  status,
  showExpired = false,
  shouldAnimate
}) => {
  const daysRemaining = getDaysRemaining(medication)
  const isExpired = status.label === 'Expired'
  const dispatch = useAppDispatch()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())
  const [deleteMedication] = useDeleteMedicationMutation()

  if (isExpired && !showExpired) return null

  const handleDelete = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Medication',
          description: `Deleting will permanently remove this medication from your pet`,
          confirmText: 'Delete Medication',
          onConfirm: async () => {
            onCloseConfirmModal()
            await deleteMedication({ id: medication.id })
              .unwrap()
              .catch(() => dispatch(setOpenSlideMessage()))
          },
          isDestructive: true,
          tokenAmount: 0
        }
      })
    )
  }

  return (
    <>
      <motion.div
        key={medication.id}
        layout
        onClick={() => {
          dispatch(setOpenMedicationDrawer())
          dispatch(setInputs({ formName: 'medicationForm', data: { ...medication, isUpdating: true } }))
        }}
        initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.96 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
      >
        {/* Delete button */}
        <motion.button
          onClick={handleDelete}
          className="absolute top-3 right-3 w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center duration-200 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </motion.button>
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
    </>
  )
}
