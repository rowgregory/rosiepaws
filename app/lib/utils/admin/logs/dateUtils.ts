import { ILog } from '@/app/types'

export const isLogToday = (log: ILog): boolean => {
  const logDate = new Date(log.createdAt)
  const today = new Date()
  return logDate.toDateString() === today.toDateString()
}

export const isLogRecent = (log: ILog, hoursAgo: number = 24): boolean => {
  const logDate = new Date(log.createdAt)
  const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)
  return logDate > cutoffDate
}
