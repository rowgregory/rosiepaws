import React, { FC } from 'react'
import { Calendar, Clock, User, FileText } from 'lucide-react'

const MiniAppointmentGraph: FC<{ appointments: any }> = ({ appointments }) => {
  if (appointments?.length === 0 || appointments === null || appointments === undefined) return

  const sortedAppointments = appointments
    ? [...appointments].sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
    : []

  const totalAppointments = appointments?.length || 0
  const upcomingCount =
    appointments?.filter((apt: any) => new Date(apt.date) > new Date() && apt.status === 'SCHEDULED').length || 0

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  // Format time
  const formatTime = (timeString: string) => {
    return timeString || 'No time set'
  }

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-rose-500 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">All Appointments</h3>
            <p className="text-sm text-gray-500">{upcomingCount} upcoming</p>
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:text-right">
          <div className="text-2xl font-bold text-fuchsia-600">{totalAppointments}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sortedAppointments.map((appointment: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(appointment.time)}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <FileText className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {appointment?.serviceType || 'General Appointment'}
                  </span>
                </div>

                {appointment.veterinarian && (
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{appointment.veterinarian}</span>
                  </div>
                )}

                {appointment.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{appointment.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      {sortedAppointments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{sortedAppointments.filter((apt: any) => apt.status === 'COMPLETED').length} completed</span>
            <span>{sortedAppointments.filter((apt: any) => apt.status === 'SCHEDULED').length} scheduled</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniAppointmentGraph
