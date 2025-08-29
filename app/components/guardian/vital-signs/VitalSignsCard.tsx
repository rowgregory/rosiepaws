import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { IVitalSigns } from '@/app/types'

import {
  getCapillaryRefillTimeLabel,
  getHydrationStatusLabel,
  getMucousMembraneLabel,
  getPetTypeLabel,
  getTimeInfo
} from '@/app/lib/utils'
import { Clock, Trash2, Heart, Thermometer, Activity, AlertTriangle } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { useDeleteVitalSignsMutation } from '@/app/redux/services/vitalSignsApi'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { NORMAL_RANGES } from '@/app/lib/constants'
import { vitalSignsDeleteTokenCost } from '@/app/lib/constants/public/token'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'

const VitalSignsCard: FC<{ vitalSigns: IVitalSigns; index: number; shouldAnimate: boolean }> = ({
  vitalSigns,
  index,
  shouldAnimate
}: any) => {
  const dispatch = useAppDispatch()
  const [deleteVitalSigns] = useDeleteVitalSignsMutation()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  // Get normal ranges for pet type
  const normalRanges = NORMAL_RANGES[vitalSigns?.pet?.type?.toUpperCase() as keyof typeof NORMAL_RANGES]

  // Check if vitals are within normal range
  const isTemperatureNormal =
    normalRanges &&
    vitalSigns.temperature >= normalRanges.temperature.min &&
    vitalSigns.temperature <= normalRanges.temperature.max
  const isHeartRateNormal =
    normalRanges &&
    vitalSigns.heartRate >= normalRanges.heartRate.min &&
    vitalSigns.heartRate <= normalRanges.heartRate.max
  const isRespiratoryNormal =
    normalRanges &&
    vitalSigns.respiratoryRate >= normalRanges.respiratoryRate.min &&
    vitalSigns.respiratoryRate <= normalRanges.respiratoryRate.max

  // Determine overall status
  const hasAbnormalVitals = !isTemperatureNormal || !isHeartRateNormal || !isRespiratoryNormal
  const statusColor = hasAbnormalVitals ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'
  const statusIcon = hasAbnormalVitals ? AlertTriangle : Heart

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Vital Signs',
          description: `Deleting will permanently remove this vital signs record from your pet.`,
          confirmText: 'Delete Record',
          onConfirm: async () => {
            onCloseConfirmModal()
            await deleteVitalSigns({ id: vitalSigns.id })
              .unwrap()
              .catch(() => dispatch(setOpenSlideMessage()))
          },
          isDestructive: true,
          tokenAmount: vitalSignsDeleteTokenCost
        }
      })
    )
  }

  const StatusIcon = statusIcon

  return (
    <motion.div
      key={vitalSigns.id}
      layout
      onClick={() => {
        dispatch(setOpenVitalSignsDrawer())
        dispatch(setInputs({ formName: 'vitalSignsForm', data: { ...vitalSigns, isUpdating: true } }))
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
        {/* Pet Info & Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">{vitalSigns?.pet?.type === 'DOG' ? 'D' : 'C'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">{vitalSigns?.pet?.name}</span>
              <div className="text-xs text-gray-500">{getPetTypeLabel(vitalSigns.petType)}</div>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{hasAbnormalVitals ? 'Review' : 'Normal'}</span>
          </div>
        </div>

        {/* Core Vital Signs */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">Temperature</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`font-semibold ${isTemperatureNormal ? 'text-gray-900' : 'text-yellow-600'}`}>
                {vitalSigns.temperature}°F
              </span>
              {!isTemperatureNormal && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">Heart Rate</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`font-semibold ${isHeartRateNormal ? 'text-gray-900' : 'text-yellow-600'}`}>
                {vitalSigns.heartRate} bpm
              </span>
              {!isHeartRateNormal && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Respiratory</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`font-semibold ${isRespiratoryNormal ? 'text-gray-900' : 'text-yellow-600'}`}>
                {vitalSigns.respiratoryRate}/min
              </span>
              {!isRespiratoryNormal && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Weight</span>
            <span className="font-semibold text-gray-900">{vitalSigns.weight} lbs</span>
          </div>
        </div>

        {/* Physical Assessment Summary */}
        <div className="space-y-2 mb-4">
          {vitalSigns.capillaryRefillTime && (
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              CRT: {getCapillaryRefillTimeLabel(vitalSigns.capillaryRefillTime)}
            </div>
          )}
          {vitalSigns.mucousMembranes && (
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              Membranes: {getMucousMembraneLabel(vitalSigns.mucousMembranes)}
            </div>
          )}
          {vitalSigns.hydrationStatus && vitalSigns.hydrationStatus !== 'NORMAL' && (
            <div className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
              {getHydrationStatusLabel(vitalSigns.hydrationStatus)}
            </div>
          )}
          {vitalSigns.bloodPressure && (
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">BP: {vitalSigns.bloodPressure}</div>
          )}
        </div>

        {/* Time Info */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Clock className="w-3 h-3" />
          <span>{getTimeInfo(new Date(vitalSigns?.createdAt))?.relative}</span>
        </div>

        {/* Notes if available */}
        {vitalSigns?.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">&quot;{vitalSigns.notes}&quot;</div>
        )}
      </div>
    </motion.div>
  )
}

export default VitalSignsCard
