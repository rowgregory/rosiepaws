import { getBloodSugarStatus, getReadingContext, getTimeInfo, getTimeOfDay } from '@/app/lib/utils'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { setOpenBloodSugarDrawer } from '@/app/redux/features/bloodSugarSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { useDeleteBloodSugarMutation } from '@/app/redux/services/bloodSugarApi'
import { useAppDispatch } from '@/app/redux/store'
import { IBloodSugar } from '@/app/types'
import { motion } from 'framer-motion'
import { Activity, Trash2 } from 'lucide-react'
import { FC } from 'react'

interface BloodSugarCardProps {
  reading: IBloodSugar
  index: number
  status: ReturnType<typeof getBloodSugarStatus>
  StatusIcon: React.ComponentType<any>
  shouldAnimate: boolean
}

const BloodSugarCard: FC<BloodSugarCardProps> = ({ reading, index, status, StatusIcon, shouldAnimate }) => {
  const dispatch = useAppDispatch()
  const [deleteFeeding] = useDeleteBloodSugarMutation()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Blood Sugar',
          description: `Deleting will permanently remove this blood sugar from your pet.`,
          confirmText: 'Delete Blood Sugar',
          onConfirm: async () => {
            onCloseConfirmModal()
            await deleteFeeding({ id: reading.id })
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
    <motion.div
      key={reading.id}
      layout
      onClick={() => {
        dispatch(setOpenBloodSugarDrawer())
        dispatch(setInputs({ formName: 'bloodSugarForm', data: { ...reading, isUpdating: true } }))
      }}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.96 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group cursor-pointer"
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
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{reading.pet?.name}</h3>
              <p className="text-xs text-gray-500">{getTimeInfo(reading.createdAt)?.relative}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          {/* Blood Sugar Value */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Blood Sugar</span>
            <div className="text-right">
              <span className="font-bold text-blue-600 text-xl">{reading.value}</span>
              <span className="text-sm text-gray-500 ml-1">mg/dL</span>
            </div>
          </div>

          {/* Time of Day */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time of Day</span>
            <span className="text-sm text-gray-900">{getTimeOfDay(reading.timeRecorded)}</span>
          </div>

          {/* Exact Time */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Taken At</span>
            <span className="text-sm text-gray-900">{getTimeInfo(new Date(reading.timeRecorded))?.time}</span>
          </div>

          {/* Reading Context */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Assessment:</p>
            <p className={`mb-2 text-sm font-medium ${status.textColor}`}>
              {getReadingContext(parseFloat(reading.value))}
            </p>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs w-fit ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              <span className="font-medium">{status.label}</span>
            </div>
          </div>

          {/* Notes (if present) */}
          {reading.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Notes:</p>
              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">&quot;{reading.notes}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default BloodSugarCard
