import { IWater } from '@/app/types'

export const getTodaysWaterLogs = (waterLogs: IWater[]) => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  return waterLogs.filter((log) => {
    const logDate = new Date(log.timeRecorded)
    return logDate >= startOfDay && logDate < endOfDay
  })
}
