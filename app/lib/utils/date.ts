export const formatDate = (dateCreated: string | number | Date, options?: any): string => {
  return new Date(dateCreated).toLocaleDateString('en-US', {
    ...options,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour12: true,
    timeZone: 'America/New_York'
  })
}

export const isToday = (date: Date | string): boolean => {
  const today = new Date()
  const checkDate = new Date(date)

  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}

export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    relative: getRelativeTime(date),
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' })
  }
}

export const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  return `${diffInDays} days ago`
}

export const formatTimeAgo = (dateString: string | Date) => {
  const now: any = new Date()
  const feedingTime: any = new Date(dateString)
  const diffInMinutes = Math.floor((now - feedingTime) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export const formatLocalDateTime = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
}

const now = new Date()
export const QUICK_TIMES = [
  { label: 'Now', value: formatLocalDateTime(now) },
  { label: '1 hour ago', value: formatLocalDateTime(new Date(now.getTime() - 60 * 60 * 1000)) },
  { label: 'This morning', value: formatLocalDateTime(new Date(now.setHours(8, 0, 0, 0))) },
  { label: 'This evening', value: formatLocalDateTime(new Date(new Date().setHours(18, 0, 0, 0))) }
]
