import { ISeizure } from '@/app/types'

// Helper function to get today's seizures
export const getTodaysSeizures = (seizures: ISeizure[]) => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  return seizures.filter((seizure) => {
    const seizureDate = new Date(seizure.timeRecorded)
    return seizureDate >= startOfDay && seizureDate < endOfDay
  })
}

// Helper function to get recent seizures within specified days
export const getRecentSeizures = (seizures: ISeizure[], days: number) => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return seizures.filter((seizure) => {
    const seizureDate = new Date(seizure.timeRecorded)
    return seizureDate >= cutoffDate
  })
}

// Utility function to format date
export const formatSeizureDate = (date: Date, format: 'yyyy-MM-dd' | 'MMMM yyyy' | 'd' = 'yyyy-MM-dd') => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  switch (format) {
    case 'MMMM yyyy':
      return `${months[date.getMonth()]} ${date.getFullYear()}`
    case 'd':
      return date.getDate().toString()
    case 'yyyy-MM-dd':
    default:
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
}

// Get calendar days for a month
export const getCalendarDays = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: Date[] = []

  // Add days from previous month if first day is not Sunday
  const startingDayOfWeek = firstDay.getDay()
  if (startingDayOfWeek > 0) {
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push(prevMonthDay)
    }
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }

  // Add days to complete the week grid
  const totalDays = days.length
  const remainingDays = 42 - totalDays // 6 rows * 7 columns
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDay = new Date(year, month + 1, i)
    days.push(nextMonthDay)
  }

  return days
}

// Navigate between months
export const changeMonth = (direction: 'prev' | 'next', setCurrentDate: any) => {
  setCurrentDate((prev: any) => {
    const newDate = new Date(prev)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    return newDate
  })
}
