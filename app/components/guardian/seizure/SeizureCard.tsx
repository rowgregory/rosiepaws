import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Zap, Video, FileText, Trash2 } from 'lucide-react'
import { formatDuration, getEmergencyLevel, getSeizureSeverity, getTimeInfo, getTimeOfDay } from '@/app/lib/utils'
import { ISeizure } from '@/app/types'
import { useAppDispatch } from '@/app/redux/store'
import { useDeleteSeizureMutation } from '@/app/redux/services/seizureApi'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { setOpenSeizureDrawer } from '@/app/redux/features/seizureSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { seizureDeleteTokenCost } from '@/app/lib/constants/public/token'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'

interface ISeizureCard {
  seizure: ISeizure
  index: number
  severity: ReturnType<typeof getSeizureSeverity>
  SeverityIcon: React.ComponentType<any>
  setSelectedVideo: any
  shouldAnimate: boolean
}

export const SeizureCard: FC<ISeizureCard> = ({
  seizure,
  index,
  severity,
  SeverityIcon,
  setSelectedVideo,
  shouldAnimate
}) => {
  const emergencyLevel = getEmergencyLevel(seizure.duration)
  const dispatch = useAppDispatch()
  const [deleteSeizure] = useDeleteSeizureMutation()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Seizure',
          description: `Deleting will permanently remove this seizure from your pet.`,
          confirmText: 'Delete Seizure',
          onConfirm: async () => {
            onCloseConfirmModal()
            await deleteSeizure({ id: seizure.id })
              .unwrap()
              .catch(() => dispatch(setOpenSlideMessage()))
          },
          isDestructive: true,
          tokenAmount: seizureDeleteTokenCost
        }
      })
    )
  }

  return (
    <motion.div
      key={seizure.id}
      layout
      onClick={() => {
        dispatch(setOpenSeizureDrawer())
        dispatch(setInputs({ formName: 'seizureForm', data: { ...seizure, isUpdating: true } }))
      }}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.96 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer"
    >
      {/* Delete button */}
      <motion.button
        onClick={handleDelete}
        className="absolute top-3 right-3 w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-opacity duration-200 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.1 }}
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </motion.button>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{seizure.pet?.name}</h3>
              <p className="text-xs text-gray-500 mb-1.5">{getTimeInfo(seizure.createdAt)?.relative}</p>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${severity.color}`}>
                <SeverityIcon className="w-3 h-3" />
                <span className="font-medium">{severity.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          {/* Duration */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <div className="text-right">
              {seizure.duration ? (
                <>
                  <span className="font-bold text-red-600 text-lg">{formatDuration(seizure.duration)}</span>
                  <div className={`text-xs font-medium ${emergencyLevel.color}`}>{emergencyLevel.level}</div>
                </>
              ) : (
                <span className="text-sm text-gray-500">Not recorded</span>
              )}
            </div>
          </div>

          {/* Time of Day */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time of Day</span>
            <span className="text-sm text-gray-900">{getTimeOfDay(seizure.timeRecorded)}</span>
          </div>

          {/* Exact Time */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Occurred At</span>
            <span className="text-sm text-gray-900">
              {getTimeInfo(new Date(seizure.timeRecorded))?.date} {getTimeInfo(new Date(seizure.timeRecorded))?.time}
            </span>
          </div>

          {/* Media and Notes */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Documentation</span>
            <div className="flex space-x-2">
              {seizure.videoUrl && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                  <Video className="w-3 h-3" />
                  <span>Video</span>
                </div>
              )}
              {seizure.notes && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">
                  <FileText className="w-3 h-3" />
                  <span>Notes</span>
                </div>
              )}
              {!seizure.videoUrl && !seizure.notes && <span className="text-xs text-gray-500">None</span>}
            </div>
          </div>

          {/* Notes (if present) */}
          {seizure.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Observations:</p>
              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">&quot;{seizure.notes}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-xs ${severity.bgColor} ${severity.textColor}`}>
              {severity.description}
            </div>
            <div className="flex space-x-2">
              <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">Edit</button>
              {seizure.videoUrl && (
                <button
                  onClick={() =>
                    setSelectedVideo({
                      url: seizure.videoUrl,
                      fileName: seizure.videoFilename,
                      petName: seizure.pet.name,
                      date: seizure.timeRecorded
                    })
                  }
                  className="text-xs text-green-600 hover:text-green-700 transition-colors"
                >
                  View Video
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export default SeizureCard
