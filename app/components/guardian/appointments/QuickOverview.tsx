import { FC } from 'react'
import { motion } from 'framer-motion'
import { IAppointment } from '@/app/types'
import {
  getCompletedAppointments,
  getTodaysAppointments,
  getUpcomingAppointments
} from '@/app/lib/utils/public/my-pets/appointments/dateUtils'
import { serviceTypeConfig } from '@/app/lib/constants/public/appointment'
import { formatDateShort, getTimeInfo } from '@/app/lib/utils'

const QuickOverview: FC<{ appointments: IAppointment[]; nextAppointment: any }> = ({
  appointments,
  nextAppointment
}) => {
  const todaysAppointments = getTodaysAppointments(appointments)
  const upcomingAppointments = getUpcomingAppointments(appointments)
  const completedCount = getCompletedAppointments(appointments)
  const totalAppointments = appointments?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
      <div className="space-y-4">
        {/* Today's Appointments Section */}
        {todaysAppointments.length > 0 && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Today&apos;s Appointments</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Scheduled Today</span>
                <span className="font-semibold text-green-900">{todaysAppointments.length}</span>
              </div>
              {todaysAppointments.map((apt, idx) => (
                <div key={idx} className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  {apt.pet.name} - {formatDateShort(apt.time)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && todaysAppointments.length === 0 && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Upcoming</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Next Appointment</span>
                <span className="font-semibold text-blue-900">
                  {new Date(nextAppointment.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {nextAppointment.pet.name} - {serviceTypeConfig[nextAppointment.serviceType].label}
              </div>
            </div>
          </div>
        )}

        {/* Overall Stats */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Appointments</span>
            <span className="font-semibold text-gray-900">{totalAppointments}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <span className="font-semibold text-gray-900">{completedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Upcoming</span>
            <span className="font-semibold text-gray-900">{upcomingAppointments.length}</span>
          </div>
          {nextAppointment && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Next Visit</span>
              <span className="font-semibold text-gray-900">{getTimeInfo(nextAppointment?.date)?.relative}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default QuickOverview
