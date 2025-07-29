import { IMedication } from '@/app/types'

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

export const getDaysRemaining = (medication: IMedication) => {
  if (!medication.endDate) return null
  const today = new Date()
  const endDate = new Date(medication.endDate)
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
