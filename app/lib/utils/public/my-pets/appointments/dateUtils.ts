import { AppointmentStatus, AppointmentType } from '@/app/types/entities'

export const getTodaysAppointments = (appointments: any[]) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    appointments?.filter((apt) => {
      const aptDate = new Date(apt?.date)
      return aptDate.getTime() >= today.getTime() && aptDate.getTime() < tomorrow.getTime()
    }) || []
  )
}

export const getUpcomingAppointments = (appointments: any[]) => {
  const now = new Date()
  return (
    appointments
      ?.filter((apt) => {
        const aptDateTime = new Date(`${apt?.date?.split?.('T')[0]}T${apt?.time}:00`)
        return aptDateTime.getTime() > now.getTime() && apt.status !== AppointmentStatus.CANCELLED
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []
  )
}

export const getCompletedAppointments = (appointments: any[]) => {
  return appointments?.filter((apt) => apt.status === AppointmentStatus.COMPLETED).length || 0
}

export const getNextAppointment = (appointments: any[]) => {
  const upcoming = getUpcomingAppointments(appointments)
  return upcoming.length > 0 ? upcoming[0] : null
}

export const isPastAppointment = (appointment: any): boolean => {
  const aptDateTime = new Date(`${appointment?.date?.split?.('T')[0]}T${appointment.time}:00`)
  return aptDateTime.getTime() < new Date().getTime()
}

export const isAppointmentToday = (appointment: any): boolean => {
  const today = new Date()
  const aptDate = new Date(appointment.date)
  return aptDate.toDateString() === today.toDateString()
}

// Type guards
export const isValidAppointmentType = (type: string): type is AppointmentType => {
  return Object.values(AppointmentType).includes(type as AppointmentType)
}

export const isValidAppointmentStatus = (status: string): status is AppointmentStatus => {
  return Object.values(AppointmentStatus).includes(status as AppointmentStatus)
}

export const isAppointmentFormValid = (inputs: any) => {
  return inputs?.petId && inputs?.date && inputs?.time && inputs?.serviceType
}
