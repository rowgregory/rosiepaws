import React, { FC } from 'react'
import { Clock, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { PainScore } from '@/app/types/entities'
import { formatDate } from '@/app/lib/utils'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenPainScoreUpdateDrawer } from '@/app/redux/features/painScoreSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { useDeletePainScoreMutation } from '@/app/redux/services/painScoreApi'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'

interface IPainScoreCard {
  painScore: PainScore
  index: number
  config: any
  IconComponent: any
}

const PainScoreCard: FC<IPainScoreCard> = ({ painScore, index, config, IconComponent }) => {
  const dispatch = useAppDispatch()
  const [deletePainScore] = useDeletePainScoreMutation()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Pain Score',
          description: `Deleting will permanently remove this pain score from your pet`,
          confirmText: 'Delete Pain Score',
          onConfirm: async () => {
            await deletePainScore({ painScoreId: painScore.id }).unwrap()
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
        dispatch(setOpenPainScoreUpdateDrawer())
        dispatch(setInputs({ formName: 'painScoreForm', data: painScore }))
      }}
      key={painScore?.id}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer group relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.96 }}
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

      {/* Header with pain level */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        <motion.div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${config.badgeBg} mb-3`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
        </motion.div>
        <h3 className={`text-2xl font-bold ${config.color} mb-1`}>{painScore?.score}</h3>
        <p className={`text-sm font-medium ${config.color} opacity-80`}>{config.label}</p>
      </motion.div>

      {/* Pet info */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <motion.div
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-gray-700 font-medium text-xs">
              {painScore?.pet?.name?.substring(0, 2).toUpperCase()}
            </span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{painScore?.pet?.name}</h4>
            <p className="text-xs text-gray-500 truncate">{painScore?.pet?.breed}</p>
          </div>
        </div>

        {painScore?.notes && (
          <motion.div
            className="bg-gray-50 rounded-lg p-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <p className="text-xs text-gray-600 line-clamp-2">{painScore?.notes}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Time stamp */}
      <motion.div
        className="pt-3 border-t border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5 }}
      >
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatDate(painScore?.timeRecorded, { style: 'full', includeSeconds: true })}</span>
        </div>
      </motion.div>

      {/* Critical indicator */}
      {painScore?.score >= 4 && (
        <motion.div
          className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.6, type: 'spring' }}
        />
      )}
    </motion.div>
  )
}

export default PainScoreCard
