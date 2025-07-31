import { getMoodColor, getMoodEmoji, getTimeInfo } from '@/app/lib/utils'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { setOpenWaterUpdateDrawer } from '@/app/redux/features/waterSlice'
import { useDeleteWaterMutation } from '@/app/redux/services/waterApi'
import { useAppDispatch } from '@/app/redux/store'
import { IWater } from '@/app/types'
import { motion } from 'framer-motion'
import { Droplets, Trash2 } from 'lucide-react'

interface WaterLogCardProps {
  waterLog: IWater
  index: number
}

const WaterLogCard: React.FC<WaterLogCardProps> = ({ waterLog, index }) => {
  const dispatch = useAppDispatch()
  const [deleteWater] = useDeleteWaterMutation(undefined)
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Water',
          description: `Deleting will permanently remove this water from your pet.`,
          confirmText: 'Delete Water',
          onConfirm: async () => {
            await deleteWater({ waterId: waterLog.id }).unwrap()
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
        dispatch(setOpenWaterUpdateDrawer())
        dispatch(setInputs({ formName: 'waterForm', data: waterLog }))
      }}
      initial={{ opacity: 0, y: 20 }}
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
        {/* Header */}
        <div className="flex items-start justify-between mb-3 pr-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{waterLog.pet?.name}</h3>
              <p className="text-xs text-gray-500">{getTimeInfo(waterLog.createdAt)?.relative}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          {/* Water Amount or Relative Intake */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount</span>
            {waterLog.milliliters && !isNaN(parseInt(waterLog.milliliters)) ? (
              <span className="font-bold text-blue-600 text-lg">{waterLog.milliliters}ml</span>
            ) : (
              <span className="font-bold text-blue-600 text-lg capitalize">Exact</span>
            )}
          </div>

          {/* Intake Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Type</span>
            <span className="font-medium text-gray-900 capitalize">{waterLog.intakeType}</span>
          </div>

          {/* Mood Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Mood</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getMoodEmoji(waterLog.moodRating)}</span>
              <span className={`font-semibold ${getMoodColor(waterLog.moodRating)}`}>{waterLog.moodRating}/4</span>
            </div>
          </div>

          {/* Time Recorded */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Recorded</span>
            <span className="text-sm text-gray-900">{getTimeInfo(new Date(waterLog.timeRecorded))?.time}</span>
          </div>

          {/* Notes (if present) */}
          {waterLog.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Notes:</p>
              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">&quot;{waterLog.notes}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default WaterLogCard
