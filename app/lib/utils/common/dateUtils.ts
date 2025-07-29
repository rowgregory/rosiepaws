// lib/shared/dateUtils.ts
export type DateInput = string | number | Date | null | undefined

export interface DateFormatOptions {
  style?: 'short' | 'medium' | 'long' | 'full' | 'month-day'
  includeTime?: boolean
  fallback?: string
}

export const formatDate = (date: DateInput, options: DateFormatOptions = {}): string => {
  const { style = 'medium', includeTime = false, fallback = 'Never' } = options

  if (!date) return fallback

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return fallback

  let formatOptions: Intl.DateTimeFormatOptions = {}

  switch (style) {
    case 'short':
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      break
    case 'medium':
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      break
    case 'long':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      break
    case 'full':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }
      break
    case 'month-day':
      formatOptions = {
        month: 'short',
        day: 'numeric'
      }
      break
  }

  if (includeTime && style !== 'full') {
    formatOptions.hour = 'numeric'
    formatOptions.minute = '2-digit'
  }

  return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj)
}

// Convenience functions
export const formatDateShort = (date: DateInput) => formatDate(date, { style: 'short' })

export const formatDateLong = (date: DateInput) => formatDate(date, { style: 'long' })

export const formatDateTime = (date: DateInput) => formatDate(date, { style: 'medium', includeTime: true })

export const formatAppointmentDate = (date: DateInput) => formatDate(date, { style: 'long' })

// formatDate(date)                               "Jan 15, 2024"
// formatDate(date, { style: 'short' })          "Jan 15, 2024"
// formatDate(date, { style: 'long' })           "Monday, January 15, 2024"
// formatDate(date, { includeTime: true })       "Jan 15, 2024, 2:30 PM"
// formatDate(null, { fallback: 'Not set' })     "Not set"

// Convenience functions:
// formatDateShort(date)      // "Jan 15, 2024"
// formatAppointmentDate(date) // "Monday, January 15, 2024"
// formatDateTime(date)       // "Jan 15, 2024, 2:30 PM"

// ===============================================================================

export const formatTime = (date: DateInput, options: { fallback?: string } = {}): string => {
  const { fallback = 'Invalid time' } = options

  if (!date) return fallback

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return fallback

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

// formatTime('2024-01-15T14:30:00')     // "2:30 PM"
// formatTime(new Date())                // "3:45 PM" (current time)
// formatTime(null)                      // "Invalid time"
// formatTime(null, { fallback: 'TBD' }) // "TBD"
// formatTime('invalid-date')            // "Invalid time"

// ===============================================================================

export const getQuickTimes = () => [
  { label: 'Just now', value: getLocalISOString(new Date()) },
  { label: '1 hour ago', value: getLocalISOString(new Date(Date.now() - 60 * 60 * 1000)) },
  { label: '2 hours ago', value: getLocalISOString(new Date(Date.now() - 2 * 60 * 60 * 1000)) },
  { label: '3 hours ago', value: getLocalISOString(new Date(Date.now() - 3 * 60 * 60 * 1000)) }
]

export const QUICK_TIMES = getQuickTimes()

export const getTimeOfDay = (timeString: string) => {
  const time = new Date(timeString)
  const hour = time.getHours()

  if (hour < 9) return '🌅 Morning'
  if (hour < 12) return '☀️ Mid-Morning'
  if (hour < 17) return '🌤️ Afternoon'
  if (hour < 20) return '🌆 Evening'
  return '🌙 Night'
}

// "Just now", "5m ago", "2h ago", "3d ago"
export const formatTimeAgo = (dateInput: Date): string => {
  const now = new Date()
  const date = new Date(dateInput)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

// "2024-01-15T14:30" (for datetime-local inputs)
export const formatLocalDateTime = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

// "2024-01-15T14:30" (for datetime-local inputs)
export function getLocalISOString(date = new Date()) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

// true/false (checks if date is today)
export const isToday = (date: Date | string): boolean => {
  const today = new Date()
  const checkDate = new Date(date)
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}

// { time: "2:30 PM", relative: "2h ago", date: "Jan 15" }
export const getTimeInfo = (date: Date) => ({
  time: formatTime(date),
  relative: formatTimeAgo(date),
  date: formatDate(date, { style: 'month-day' })
})
