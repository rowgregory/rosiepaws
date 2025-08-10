import { serviceTypeConfig, statusConfig } from '@/app/lib/constants/public/appointment'
import { isAppointmentToday, isPastAppointment } from '@/app/lib/utils/public/my-pets/appointments/dateUtils'
import { IAppointment } from '@/app/types'
import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Stethoscope, Trash2 } from 'lucide-react'
import { getTimeInfo } from '@/app/lib/utils'
import { useAppDispatch } from '@/app/redux/store'
import { useDeleteAppointmentMutation } from '@/app/redux/services/appointmentApi'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { setOpenAppointmentDrawer } from '@/app/redux/features/appointmentSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { appointmentDeleteTokenCost } from '@/app/lib/constants/public/token'

const AppointmentCard: FC<{ appointment: IAppointment; index: number; shouldAnimate: boolean }> = ({
  appointment,
  index,
  shouldAnimate
}) => {
  const serviceConfig = serviceTypeConfig[appointment.serviceType]
  const statusDisplay = statusConfig[appointment.status]
  const appointmentDate = new Date(appointment.date)
  const isPast = isPastAppointment(appointment)
  const isToday = isAppointmentToday(appointment)
  const dispatch = useAppDispatch()
  const [deleteAppointment] = useDeleteAppointmentMutation()
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())

  const handleDelete = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Appointment',
          description: `Deleting will permanently remove this appointment from your pet`,
          confirmText: 'Delete Appointment',
          onConfirm: async () => {
            onCloseConfirmModal()
            await deleteAppointment({ id: appointment.id })
              .unwrap()
              .catch(() => dispatch(setOpenSlideMessage()))
          },
          isDestructive: true,
          tokenAmount: appointmentDeleteTokenCost
        }
      })
    )
  }

  return (
    <motion.div
      key={appointment.id}
      layout
      onClick={() => {
        dispatch(setOpenAppointmentDrawer())
        dispatch(setInputs({ formName: 'appointmentForm', data: { ...appointment, isUpdating: true } }))
      }}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.96 }}
      className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all hover:scale-105 relative cursor-pointer ${
        isPast
          ? 'opacity-75 border-gray-200'
          : isToday
            ? 'border-green-400 bg-green-50 ring-2 ring-green-200'
            : 'border-gray-100'
      }`}
    >
      {/* Today Badge */}
      {isToday && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
        >
          TODAY
        </motion.div>
      )}

      {/* Past Appointment Overlay */}
      {isPast && (
        <div className="absolute top-3 right-3 text-gray-400">
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">Past</span>
        </div>
      )}
      {/* Pet Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">{appointment?.pet?.type === 'DOG' ? 'D' : 'C'}</span>
          </div>
          <span className="font-medium text-gray-900">{appointment?.pet?.name}</span>
        </div>

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
      </div>

      {/* Appointment Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Service</span>
          <span className="font-semibold text-gray-900">{serviceConfig.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Date</span>
          <span className="font-semibold text-gray-900">{appointmentDate.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Time</span>
          <span className="font-semibold text-gray-900">{appointment.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status</span>
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}
          >
            <span>{statusDisplay.label}</span>
          </div>
        </div>
      </div>

      {/* Veterinarian */}
      {appointment.veterinarian && (
        <div className="mb-4">
          <div className="inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Stethoscope className="w-3 h-3" />
            <span>{appointment.veterinarian}</span>
          </div>
        </div>
      )}

      {/* Time Info */}
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <Calendar className="w-3 h-3" />
        <span>{getTimeInfo(appointment?.createdAt)?.relative}</span>
      </div>

      {/* Description/Notes if available */}
      {appointment?.description && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">&quot;{appointment.description}&quot;</div>
      )}
      {appointment?.notes && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700 border border-yellow-200">
          Note: {appointment.notes}
        </div>
      )}
    </motion.div>
  )
}

export default AppointmentCard
