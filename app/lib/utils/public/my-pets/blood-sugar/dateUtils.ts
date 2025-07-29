import { IBloodSugar } from '@/app/types'
import { isToday } from '../../..'

export const getTodaysBloodSugarLogs = (bloodSugars: any[]) => {
  if (!bloodSugars || bloodSugars?.length === 0) return []

  return bloodSugars.filter((reading) => {
    const readingDate = reading?.timeRecorded
    return isToday(readingDate)
  })
}

// Helper function to suggest next reading time
export const getNextReadingSuggestion = (todaysReadings: IBloodSugar[]) => {
  if (todaysReadings.length === 0) return 'Start with morning reading'

  const now = new Date()
  const currentHour = now.getHours()

  // Typical blood sugar monitoring schedule
  const suggestedTimes = [
    { time: '07:00', label: 'Before breakfast' },
    { time: '11:00', label: 'Mid-morning' },
    { time: '17:00', label: 'Before dinner' },
    { time: '21:00', label: 'Evening' }
  ]

  // Find next suggested time that hasn't been used today
  const readingTimes = todaysReadings.map((r) => {
    const time = new Date(r.timeRecorded)
    return time.getHours()
  })

  for (const suggested of suggestedTimes) {
    const suggestedHour = parseInt(suggested.time.split(':')[0])
    if (suggestedHour > currentHour && !readingTimes.includes(suggestedHour)) {
      return suggested.label
    }
  }

  return 'Evening reading'
}
