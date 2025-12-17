import { FC } from 'react'
import { motion } from 'framer-motion'
import { serviceTypeConfig, statusConfig } from '@/app/lib/constants/public/appointment'
import { Stethoscope } from 'lucide-react'
import { formatAppointmentDate } from '@/app/lib/utils'

const NextAppointment: FC<{ nextAppointment: any }> = ({ nextAppointment }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Next Appointment</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center ${statusConfig?.[nextAppointment?.status]?.color}`}
          >
            {statusConfig?.[nextAppointment?.status]?.label}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{nextAppointment?.pet?.name}</h3>
            <p className="text-sm text-gray-500">{formatAppointmentDate(new Date(nextAppointment?.date))}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="text-left sm:text-center">
              <div className="text-2xl font-bold text-gray-900">{nextAppointment?.time}</div>
              <div className="text-sm text-gray-500">time</div>
            </div>
            <div className="text-left sm:text-center">
              <div className="text-2xl">{serviceTypeConfig[nextAppointment?.serviceType]?.icon}</div>
              <div className="text-sm text-gray-500">{serviceTypeConfig[nextAppointment?.serviceType]?.label}</div>
            </div>
            {nextAppointment?.veterinarian && (
              <div className="text-left sm:text-center">
                <Stethoscope className="w-6 h-6 sm:mx-auto text-gray-400 mb-1" />
                <div className="text-sm font-medium text-gray-900">{nextAppointment?.veterinarian}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NextAppointment
