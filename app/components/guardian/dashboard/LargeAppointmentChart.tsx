import React, { useState, useMemo, FC } from 'react'
import { Calendar, Clock, User, MapPin, ChevronRight, AlertCircle } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

type AppointmentType = 'CHECKUP' | 'VACCINATION' | 'SURGERY' | 'DENTAL' | 'EMERGENCY'
type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

interface Appointment {
  date: string
  time: string
  serviceType: string
  status: string
  description: string
  veterinarian: string
  reminderEnabled: boolean
  reminderTime: string
}

interface ChartData {
  month: string
  total: number
  CHECKUP: number
  VACCINATION: number
  SURGERY: number
  DENTAL: number
  EMERGENCY: number
  [key: string]: string | number | any
}

interface ServiceTypeData {
  name: string
  value: number
  count: number
}

interface StatusData {
  name: string
  value: number
}

interface VeterinarianData {
  veterinarian: string
  appointments: number
}

interface ChartType {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
}

interface LargeAppointmentChartProps {
  appointments: any[]
}

const LargeAppointmentChart: FC<LargeAppointmentChartProps> = ({ appointments }) => {
  const [selectedChart, setSelectedChart] = useState<string>('timeline')

  // Prepare data for different chart types
  const timelineData = useMemo((): ChartData[] => {
    const monthlyData: Record<string, ChartData> = {}

    appointments?.forEach((apt: Appointment) => {
      const monthKey = new Date(apt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          total: 0,
          CHECKUP: 0,
          VACCINATION: 0,
          SURGERY: 0,
          DENTAL: 0,
          EMERGENCY: 0
        }
      }
      monthlyData[monthKey].total++
      monthlyData[monthKey][apt.serviceType]++
    })

    return Object.values(monthlyData).sort(
      (a, b) => new Date(a.month + ' 1').getTime() - new Date(b.month + ' 1').getTime()
    )
  }, [appointments])

  const serviceTypeData = useMemo((): ServiceTypeData[] => {
    const typeCount: Record<string, number> = {}
    appointments?.forEach((apt: Appointment) => {
      typeCount[apt.serviceType] = (typeCount[apt.serviceType] || 0) + 1
    })

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type.charAt(0) + type.slice(1).toLowerCase(),
      value: count,
      count
    }))
  }, [appointments])

  const statusData = useMemo((): StatusData[] => {
    const statusCount: Record<string, number> = {}
    appointments?.forEach((apt: Appointment) => {
      statusCount[apt.status] = (statusCount[apt.status] || 0) + 1
    })

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0) + status.slice(1).toLowerCase(),
      value: count
    }))
  }, [appointments])

  const veterinarianData = useMemo((): VeterinarianData[] => {
    const vetCount: Record<string, number> = {}
    appointments?.forEach((apt: Appointment) => {
      if (apt.veterinarian) {
        vetCount[apt.veterinarian] = (vetCount[apt.veterinarian] || 0) + 1
      }
    })

    return Object.entries(vetCount).map(([vet, count]) => ({
      veterinarian: vet,
      appointments: count
    }))
  }, [appointments])

  const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const chartTypes: ChartType[] = [
    { id: 'timeline', name: 'Timeline View', icon: Calendar },
    { id: 'services', name: 'Service Types', icon: MapPin },
    { id: 'status', name: 'Status Overview', icon: Clock },
    { id: 'veterinarians', name: 'Veterinarians', icon: User },
    { id: 'detailed', name: 'Detailed List', icon: ChevronRight }
  ]

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'SCHEDULED':
        return <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
      case 'CANCELLED':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      case 'RESCHEDULED':
        return <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    }
  }

  const getServiceTypeIcon = (serviceType: AppointmentType) => {
    switch (serviceType) {
      case 'CHECKUP':
        return <Calendar className="w-4 h-4 text-blue-600" />
      case 'VACCINATION':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'SURGERY':
        return <MapPin className="w-4 h-4 text-red-600" />
      case 'DENTAL':
        return <User className="w-4 h-4 text-green-600" />
      case 'EMERGENCY':
        return <Clock className="w-4 h-4 text-orange-600" />
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(a.date)
      const [hoursA, minutesA] = a.time.split(':')
      dateA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0)

      const dateB = new Date(b.date)
      const [hoursB, minutesB] = b.time.split(':')
      dateB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0)

      return dateB.getTime() - dateA.getTime() // Most recent first
    })
  }, [appointments])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Appointment Analytics</h2>
            <p className="text-sm text-gray-500">Comprehensive appointment tracking and insights</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-600">{appointments?.length}</div>
          <div className="text-sm text-gray-500">Total Appointments</div>
          <div className="text-xs text-gray-400 mt-1">
            Next:{' '}
            {(() => {
              const nextApt = appointments
                .filter((apt) => {
                  const appointmentDate = new Date(apt.date)
                  const [hours, minutes] = apt.time.split(':')
                  appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
                  return appointmentDate > new Date()
                })
                .sort((a, b) => {
                  const dateA = new Date(a.date)
                  const [hoursA, minutesA] = a.time.split(':')
                  dateA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0)

                  const dateB = new Date(b.date)
                  const [hoursB, minutesB] = b.time.split(':')
                  dateB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0)

                  return dateA.getTime() - dateB.getTime()
                })[0]
              return nextApt ? `${new Date(nextApt.date).toLocaleDateString()} at ${nextApt.time}` : 'None scheduled'
            })()}
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chartTypes.map((chart) => {
          const IconComponent = chart.icon
          return (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedChart === chart.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{chart.name}</span>
            </button>
          )
        })}
      </div>

      {/* Chart Display */}
      <div className="h-96">
        {selectedChart === 'timeline' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                name="Total Appointments"
              />
              <Line
                type="monotone"
                dataKey="CHECKUP"
                stroke="#EC4899"
                strokeWidth={2}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 3 }}
                name="Checkups"
              />
              <Line
                type="monotone"
                dataKey="VACCINATION"
                stroke="#F472B6"
                strokeWidth={2}
                dot={{ fill: '#F472B6', strokeWidth: 2, r: 3 }}
                name="Vaccinations"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {selectedChart === 'services' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceTypeData.map((entry: ServiceTypeData, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}

        {selectedChart === 'status' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <defs>
                <linearGradient id="purplePinkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="url(#purplePinkGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {selectedChart === 'veterinarians' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={veterinarianData} layout="horizontal">
              <defs>
                <linearGradient id="purplePinkGradientHorizontal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="veterinarian" type="category" className="text-xs" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="appointments" fill="url(#purplePinkGradientHorizontal)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {selectedChart === 'detailed' && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              <span className="text-sm text-gray-500">{sortedAppointments.length} appointments</span>
            </div>

            {sortedAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No appointments found with current filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getServiceTypeIcon(appointment.serviceType)}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {appointment.serviceType.charAt(0) + appointment.serviceType.slice(1).toLowerCase()}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {appointment.pet.name} • {appointment.pet.type}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{formatTime(appointment.time)}</span>
                          </div>
                          {appointment.veterinarian && (
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700">{appointment.veterinarian}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {getStatusIcon(appointment.status)}
                            <span className="text-gray-700 capitalize">{appointment.status.toLowerCase()}</span>
                          </div>
                        </div>

                        {appointment.description && (
                          <p className="text-sm text-gray-600 mt-2 bg-white p-2 rounded border">
                            {appointment.description}
                          </p>
                        )}

                        {appointment.notes && (
                          <p className="text-xs text-gray-500 mt-2 italic">Notes: {appointment.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-purple-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-purple-600">{appointments?.length}</div>
          <div className="text-xs text-gray-600">Total Appointments</div>
        </div>
        <div className="text-center p-3 bg-pink-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-pink-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-pink-600">
            {appointments?.filter((apt) => apt.status === 'COMPLETED').length}
          </div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center p-3 bg-violet-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <MapPin className="w-4 h-4 text-violet-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-violet-600">
            {appointments?.filter((apt) => apt.status === 'SCHEDULED').length}
          </div>
          <div className="text-xs text-gray-600">Upcoming</div>
        </div>
        <div className="text-center p-3 bg-fuchsia-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <User className="w-4 h-4 text-fuchsia-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-fuchsia-600">
            {new Set(appointments?.map((apt: Appointment) => apt.veterinarian)).size}
          </div>
          <div className="text-xs text-gray-600">Veterinarians</div>
        </div>
      </div>
    </div>
  )
}

export default LargeAppointmentChart
