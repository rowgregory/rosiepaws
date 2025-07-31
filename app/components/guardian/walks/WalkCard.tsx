import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { IWalk } from '@/app/types'
import { getDistanceMiles, getDurationMinutes, getMoodData, getPaceColor, getTimeInfo } from '@/app/lib/utils'
import { Clock, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenWalkUpdateDrawer } from '@/app/redux/features/walkSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { useDeleteWalkMutation } from '@/app/redux/services/walkApi'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'

const WalkCard: FC<{ walk: IWalk; index: number }> = ({ walk, index }) => {
  const dispatch = useAppDispatch()
  const moodData = getMoodData(walk?.moodRating || 0)
  const MoodIcon = moodData.icon
  const paceColor = getPaceColor(walk?.pace || '')
  const currentDistance = getDistanceMiles(walk.distance)
  const currentDuration = getDurationMinutes(walk.duration)
  const [deleteWalk] = useDeleteWalkMutation()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Walk',
          description: `Deleting will permanently remove this walk from your pet.`,
          confirmText: 'Delete Walk',
          onConfirm: async () => {
            await deleteWalk({ walkId: walk.id }).unwrap()
            onCloseConfirmModal()
          },
          isDestructive: true
        }
      })
    )
  }

  return (
    <motion.div
      onClick={() => {
        dispatch(setOpenWalkUpdateDrawer())
        dispatch(setInputs({ formName: 'walkForm', data: walk }))
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group cursor-pointer"
    >
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
      </motion.button>{' '}
      <div className="p-4">
        {/* Pet Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">{walk?.pet?.type === 'DOG' ? 'D' : 'C'}</span>
            </div>
            <span className="font-medium text-gray-900">{walk?.pet?.name}</span>
          </div>
          <MoodIcon className={`w-5 h-5 ${moodData.iconColor}`} />
        </div>

        {/* Walk Stats */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Distance</span>
            <span className="font-semibold text-gray-900">{currentDistance} miles</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="font-semibold text-gray-900">{currentDuration}:00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mood</span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${moodData.color}`}>
              <span>{walk?.moodRating}/4</span>
            </div>
          </div>
        </div>

        {/* Pace and Distraction */}
        <div className="space-y-2 mb-4">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paceColor}`}>
            {walk?.pace}
          </div>
          {walk?.distraction && (
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">Distraction: {walk.distraction}</div>
          )}
        </div>

        {/* Time Info */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Clock className="w-3 h-3" />
          <span>{getTimeInfo(walk?.createdAt)?.relative}</span>
        </div>

        {/* Notes if available */}
        {walk?.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">&quot;{walk.notes}&quot;</div>
        )}
      </div>
    </motion.div>
  )
}

export default WalkCard
