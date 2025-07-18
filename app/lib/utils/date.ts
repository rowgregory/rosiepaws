export const formatTimeAgo = (dateInput: Date): string => {
  const now = new Date()
  const date = new Date(dateInput)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

// For datetime-local inputs
export const formatLocalDateTime = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

// For filtering today's data
export const isToday = (date: Date | string): boolean => {
  const today = new Date()
  const checkDate = new Date(date)
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}

export const getTimeInfo = (date: Date) => ({
  time: new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  relative: formatTimeAgo(date),
  date: new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })
})
