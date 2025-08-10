import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, AlertTriangle, Trash2 } from 'lucide-react'
import { IMovement } from '@/app/types'
import {
  getActivityLevelColor,
  getConcerningSigns,
  getEnergyTrend,
  getMovementTypeIcon,
  getPainTrend
} from '@/app/lib/utils'
import { useAppDispatch } from '@/app/redux/store'
import { useDeleteMovementMutation } from '@/app/redux/services/movementApi'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { setOpenMovementDrawer } from '@/app/redux/features/movementSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { movementDeleteTokenCost } from '@/app/lib/constants/public/token'
import SlideMessage from '../../auth/SlideMessage'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'

interface IMovementCard {
  movement: IMovement
  index: number
  shouldAnimate: boolean
}

const MovementCard: FC<IMovementCard> = ({ movement, index, shouldAnimate }) => {
  const typeInfo = getMovementTypeIcon(movement.movementType)
  const TypeIcon = typeInfo.icon
  const painTrend = getPainTrend(movement)
  const energyTrend = getEnergyTrend(movement)
  const concerningSigns = getConcerningSigns(movement)
  const dispatch = useAppDispatch()
  const [deleteMovement] = useDeleteMovementMutation() as any
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Movement',
          description: `Deleting will permanently remove this movement from your pet.`,
          confirmText: 'Delete Movement',
          onConfirm: async () => {
            onCloseConfirmModal()
            await deleteMovement({ id: movement.id })
              .unwrap()
              .catch(() => dispatch(setOpenSlideMessage()))
          },
          isDestructive: true,
          tokenAmount: movementDeleteTokenCost
        }
      })
    )
  }

  return (
    <>
      <SlideMessage message="An error occurred. Please try again." type="Error" />
      <motion.div
        key={movement.id}
        layout
        onClick={() => {
          dispatch(setOpenMovementDrawer())
          dispatch(setInputs({ formName: 'movementForm', data: { ...movement, isUpdating: true } }))
        }}
        initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.96 }}
        className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow group relative"
      >
        {/* Delete button - top right */}
        <motion.button
          onClick={handleDelete}
          className="absolute top-3 right-3 w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </motion.button>

        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between pr-10">
            {' '}
            {/* Add pr-10 for delete button space */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gray-50 ${typeInfo.color}`}>
                <TypeIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {movement.movementType
                    .replace('_', ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h3>
                <p className="text-xs text-gray-500">{movement.pet?.name}</p>
              </div>
            </div>
            {/* Activity Level Badge */}
            {movement.activityLevel && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border text-center ${getActivityLevelColor(movement.activityLevel)}`}
              >
                {movement.activityLevel.replace('_', ' ').toLowerCase()}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Duration and Distance */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{movement.durationMinutes || '0'} min</span>
            </div>
            {movement.distanceMeters && (
              <div className="text-gray-600">
                {movement.distanceMeters >= 1000
                  ? `${(movement.distanceMeters / 1000).toFixed(1)}km`
                  : `${movement.distanceMeters}m`}
              </div>
            )}
          </div>

          {/* Location */}
          {movement.location && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{movement.location}</span>
              {movement.indoor && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Indoor</span>}
            </div>
          )}

          {/* Pain and Energy Trends */}
          <div className="flex items-center justify-between">
            {painTrend && (
              <div className="flex items-center space-x-1">
                <painTrend.icon className={`w-4 h-4 ${painTrend.color}`} />
                <span className="text-xs text-gray-600">Pain</span>
              </div>
            )}
            {energyTrend && (
              <div className="flex items-center space-x-1">
                <energyTrend.icon className={`w-4 h-4 ${energyTrend.color}`} />
                <span className="text-xs text-gray-600">Energy</span>
              </div>
            )}
          </div>

          {/* Concerning Signs Alert */}
          {concerningSigns.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              <div className="flex items-center space-x-1 mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-800">Concerns Noted</span>
              </div>
              <div className="text-xs text-yellow-700">{concerningSigns.join(', ')}</div>
            </div>
          )}

          {/* Equipment Used */}
          {(movement.wheelchair || movement.harness || movement.leash) && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Equipment:</span>
              <div className="flex space-x-1">
                {movement.wheelchair && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Wheelchair</span>
                )}
                {movement.harness && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Harness</span>
                )}
                {movement.leash && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Leash</span>}
              </div>
            </div>
          )}

          {/* Assistance Level */}
          {movement.assistance && movement.assistance !== 'NONE' && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Assistance:</span> {movement.assistance.replace('_', ' ').toLowerCase()}
            </div>
          )}

          {/* Rest and Recovery */}
          {(movement.restBreaks && movement.restBreaks > 0) ||
            (movement.recoveryTime && movement.recoveryTime > 0 && (
              <div className="text-xs text-gray-600 space-y-1">
                {movement.restBreaks && movement.restBreaks > 0 && <div>Rest breaks: {movement.restBreaks}</div>}
                {movement.recoveryTime && movement.recoveryTime > 0 && (
                  <div>Recovery time: {movement.recoveryTime} min</div>
                )}
              </div>
            ))}

          {/* Notes Preview */}
          {movement.notes && (
            <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
              <span className="font-medium">Notes:</span> {movement.notes.slice(0, 60)}
              {movement.notes.length > 60 && '...'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(movement.timeRecorded).toLocaleDateString()}</span>
            <span>
              {new Date(movement.timeRecorded).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default MovementCard
