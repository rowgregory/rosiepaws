import { IMedication } from '@/app/types'
import { CheckCircle, XCircle, Calendar } from 'lucide-react'

interface TimeRemaining {
  hours: number
  minutes: number
  isOverdue: boolean
}

export const isMedicationFormValid = (inputs: any) => {
  return (
    inputs?.petId && inputs?.drugName && inputs?.dosage && inputs?.dosageUnit && inputs?.frequency && inputs?.startDate
  )
}

// Calculate time until next medication
export const getTimeUntilNext = (reminderTimes: string[], currentTime: Date): TimeRemaining | null => {
  if (!reminderTimes || reminderTimes.length === 0) return null

  const now = currentTime
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTotalMinutes = currentHour * 60 + currentMinute

  // Convert reminder times to minutes and sort them
  const reminderMinutes = reminderTimes
    .map((time) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    })
    .sort((a, b) => a - b)

  // Check if any reminder time has passed today (overdue)
  const isOverdue = reminderMinutes.some((time) => time < currentTotalMinutes)

  // Find next reminder time
  let nextReminderMinutes = reminderMinutes.find((time) => time > currentTotalMinutes)

  // If no reminder today, take first reminder tomorrow
  if (!nextReminderMinutes) {
    nextReminderMinutes = reminderMinutes[0] + 24 * 60 // Add 24 hours
  }

  const diffMinutes = nextReminderMinutes - currentTotalMinutes
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  return {
    hours,
    minutes,
    isOverdue
  }
}

// Format time remaining
export const formatTimeRemaining = (timeRemaining: TimeRemaining | null) => {
  if (!timeRemaining) return 'No schedule'

  if (timeRemaining.hours === 0 && timeRemaining.minutes === 0) {
    return 'Due now'
  }

  if (timeRemaining.hours === 0) {
    return `${timeRemaining.minutes}m`
  }

  if (timeRemaining.minutes === 0) {
    return `${timeRemaining.hours}h`
  }

  return `${timeRemaining.hours}h ${timeRemaining.minutes}m`
}

// Get next dose time
export const getNextDoseTime = (reminderTimes: string[], currentTime: Date) => {
  if (!reminderTimes || reminderTimes.length === 0) return 'Not scheduled'

  const now = currentTime
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTotalMinutes = currentHour * 60 + currentMinute

  const reminderMinutes = reminderTimes
    .map((time) => {
      const [hours, minutes] = time.split(':').map(Number)
      return { time, totalMinutes: hours * 60 + minutes }
    })
    .sort((a, b) => a.totalMinutes - b.totalMinutes)

  const nextReminder = reminderMinutes.find((r) => r.totalMinutes > currentTotalMinutes) || reminderMinutes[0]
  const isNextDay = !reminderMinutes.find((r) => r.totalMinutes > currentTotalMinutes)

  return `${nextReminder.time}${isNextDay ? ' (tomorrow)' : ''}`
}

// Helper function to get default reminder times based on frequency
export const getDefaultReminderTimes = (frequency: string): string[] => {
  switch (frequency) {
    case 'once-daily':
      return ['08:00'] // Morning dose

    case 'twice-daily':
      return ['08:00', '20:00'] // Morning and evening (12 hours apart)

    case 'three-times-daily':
      return ['08:00', '14:00', '20:00'] // Morning, afternoon, evening (6-8 hours apart)

    case 'four-times-daily':
      return ['08:00', '12:00', '16:00', '20:00'] // Every 6 hours

    case 'every-other-day':
      return ['08:00'] // Same time on scheduled days

    case 'weekly':
      return ['08:00'] // Same time weekly

    case 'as-needed':
      return [] // No scheduled reminders for PRN medications

    case 'custom':
      return ['08:00'] // Default single time, user can customize

    default:
      return ['08:00'] // Fallback to morning dose
  }
}

// Helper function to get active medications (not expired)
export const getActiveMedications = (medications: IMedication[]) => {
  const today = new Date()
  return medications.filter((med) => {
    if (!med.endDate) return true // No end date means ongoing
    const endDate = new Date(med.endDate)
    return endDate >= today
  })
}

// Helper function to get today's medications
export const getTodaysMedications = (medications: IMedication[]) => {
  const today = new Date()
  return medications.filter((med) => {
    const startDate = new Date(med.startDate)
    const endDate = med.endDate ? new Date(med.endDate) : null

    return startDate <= today && (!endDate || endDate >= today)
  })
}

// Helper function to get upcoming reminders (next 4 hours)
export const getUpcomingReminders = (medications: IMedication[]) => {
  const now = new Date()
  const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000)

  return medications.filter((med) => {
    if (!med.reminderEnabled || !med.reminderTimes.length) return false

    // Check if any reminder time is within the next 4 hours
    return med.reminderTimes.some((time) => {
      const [hours, minutes] = time.split(':').map(Number)
      const reminderTime = new Date()
      reminderTime.setHours(hours, minutes, 0, 0)

      return reminderTime >= now && reminderTime <= fourHoursLater
    })
  })
}

// Helper function to get medication status
export const getMedicationStatus = (medication: IMedication) => {
  const now = new Date()
  const startDate = new Date(medication.startDate)
  const endDate = medication.endDate ? new Date(medication.endDate) : null

  // Check if expired
  if (endDate && endDate < now) {
    return {
      icon: XCircle,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      label: 'Expired',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-900',
      description: 'Treatment period ended'
    }
  }

  // Check if not started yet
  if (startDate > now) {
    return {
      icon: Calendar,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Scheduled',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: 'Treatment not started yet'
    }
  }

  // Active medication
  return {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Active',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    description: 'Currently active'
  }
}

// Helper function to get today's medication schedule
export const getTodaysMedicationSchedule = (medications: IMedication[]) => {
  const today = new Date()
  const schedule: Array<{
    medication: IMedication
    time: string
    status: 'completed' | 'upcoming' | 'scheduled'
  }> = []

  medications.forEach((med) => {
    if (!med.reminderEnabled || !med.reminderTimes.length) return

    // Check if medication is active today
    const startDate = new Date(med.startDate)
    const endDate = med.endDate ? new Date(med.endDate) : null
    if (startDate > today || (endDate && endDate < today)) return

    med.reminderTimes.forEach((time: string) => {
      const [hours, minutes] = time.split(':').map(Number)
      const reminderTime = new Date()
      reminderTime.setHours(hours, minutes, 0, 0)

      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      const wasAlreadySent = med.sentRemindersToday.includes(timeString)

      let status: 'completed' | 'upcoming' | 'scheduled'
      if (wasAlreadySent) {
        status = 'completed'
      } else if (reminderTime > today) {
        status = 'upcoming'
      } else {
        status = 'scheduled' // Past time but not marked as given
      }

      schedule.push({
        medication: med,
        time: timeString,
        status
      })
    })
  }) // Sort by time
  return schedule.sort((a, b) => a.time.localeCompare(b.time))
}

// Helper function to get upcoming time description
export const getUpcomingTime = (medication: IMedication) => {
  const now = new Date()
  const upcomingTimes = medication.reminderTimes.filter((time) => {
    const [hours, minutes] = time.split(':').map(Number)
    const reminderTime = new Date()
    reminderTime.setHours(hours, minutes, 0, 0)
    return reminderTime > now
  })

  if (upcomingTimes.length === 0) return 'No upcoming doses today'

  // Return the next upcoming time
  const nextUpcoming = upcomingTimes.sort()[0]
  return nextUpcoming || 'Unknown'
}

export const getFrequencyDisplay = (frequency: string, customFrequency?: string) => {
  if (frequency === 'custom' && customFrequency) {
    return customFrequency
  }

  const frequencyMap: Record<string, string> = {
    'once-daily': 'Once daily',
    'twice-daily': 'Twice daily',
    'three-times-daily': '3x daily',
    'four-times-daily': '4x daily',
    'every-other-day': 'Every other day',
    weekly: 'Weekly',
    'as-needed': 'As needed'
  }

  return frequencyMap[frequency] || frequency
}

export const getDaysRemaining = (medication: IMedication) => {
  if (!medication.endDate) return null
  const today = new Date()
  const endDate = new Date(medication.endDate)
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'text-blue-600'
    case 'completed':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'Upcoming'
    case 'completed':
      return 'Given'
    default:
      return 'Scheduled'
  }
}
