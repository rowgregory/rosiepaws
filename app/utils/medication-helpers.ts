import { Clock, AlertCircle, CheckCircle, Bell, BellOff } from 'lucide-react'

interface TimeRemaining {
  hours: number
  minutes: number
  isOverdue: boolean
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
    isOverdue: diffMinutes < 0
  }
}

// Get status badge for medication
export const getMedicationStatus = (medication: any, currentTime: Date) => {
  const timeRemaining = getTimeUntilNext(medication.reminderTimes, currentTime)
  const today = new Date().toDateString()

  if (!medication.reminderEnabled) {
    return { status: 'disabled', color: 'bg-gray-100 text-gray-600', icon: BellOff }
  }

  if (timeRemaining?.isOverdue) {
    return { status: 'overdue', color: 'bg-red-100 text-red-700', icon: AlertCircle }
  }

  if (timeRemaining && timeRemaining.hours === 0 && timeRemaining.minutes <= 30) {
    return { status: 'upcoming', color: 'bg-amber-100 text-amber-700', icon: Clock }
  }

  // Check if given today
  const hasBeenGivenToday = medication.sentRemindersToday?.length > 0 && medication.lastReminderDate === today

  if (hasBeenGivenToday) {
    return { status: 'completed', color: 'bg-green-100 text-green-700', icon: CheckCircle }
  }

  return { status: 'scheduled', color: 'bg-blue-100 text-blue-700', icon: Bell }
}

// Format time remaining
export const formatTimeRemaining = (timeRemaining: TimeRemaining | null) => {
  if (!timeRemaining) return 'No schedule'

  if (timeRemaining.isOverdue) {
    return 'Overdue'
  }

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
