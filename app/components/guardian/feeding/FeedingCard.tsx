import { FC } from 'react'
import { formatDateShort, formatTimeAgo, getFoodTypeConfig } from '@/app/lib/utils'
import { setOpenFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { motion } from 'framer-motion'
import { IFeeding } from '@/app/types'
import { useAppDispatch } from '@/app/redux/store'
import { Trash2 } from 'lucide-react'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { useDeleteFeedingMutation } from '@/app/redux/services/feedingApi'
import { feedingDeleteTokenCost } from '@/app/lib/constants/public/token'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'

const FeedingCard: FC<{ feeding: IFeeding; index: number; shouldAnimate: boolean }> = ({
  feeding,
  index,
  shouldAnimate
}) => {
  const foodTypeConfig = getFoodTypeConfig(feeding.foodType)
  const dispatch = useAppDispatch()
  const [deleteFeeding] = useDeleteFeedingMutation()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Feeding',
          description: `Deleting will permanently remove this feeding from your pet.`,
          confirmText: 'Delete Feeding',
          onConfirm: async () => {
            onCloseConfirmModal()
            await deleteFeeding({ id: feeding.id })
              .unwrap()
              .catch(() => dispatch(setOpenSlideMessage()))
          },
          isDestructive: true,
          tokenAmount: feedingDeleteTokenCost
        }
      })
    )
  }

  return (
    <motion.div
      key={feeding.id}
      layout
      onClick={() => {
        dispatch(setOpenFeedingDrawer())
        dispatch(setInputs({ formName: 'feedingForm', data: { ...feeding, isUpdating: true } }))
      }}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
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
        {/* Header with pet avatar and food type */}
        <div className="text-center mb-4">
          <h4 className="font-semibold text-gray-900 text-lg truncate">{feeding?.pet?.name}</h4>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${foodTypeConfig.badge} mt-2`}
          >
            {foodTypeConfig.icon} {foodTypeConfig.name}
          </span>
        </div>

        {/* Food amount - large display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">{feeding.foodAmount}</div>
          <div className="text-sm text-gray-500">
            cup{+feeding?.foodAmount > 1 ? 's' : ''} of {feeding.foodType}
          </div>
        </div>

        {/* Mood rating */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Mood: {feeding.moodRating}/4</span>
        </div>

        {/* Notes (if available) */}
        {feeding.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600 line-clamp-2">{feeding.notes}</p>
          </div>
        )}

        {/* Timestamp at bottom */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              {formatDateShort(feeding.timeRecorded || feeding.createdAt)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatTimeAgo(new Date(feeding.timeRecorded || feeding.createdAt))}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FeedingCard
