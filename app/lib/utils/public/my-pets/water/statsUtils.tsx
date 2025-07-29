import { IWater } from '@/app/types'

export const getIntakeTypeStats = (waterLogs: IWater[]) => {
  const stats = waterLogs.reduce(
    (acc, log) => {
      const type = log.intakeType.toLowerCase()
      acc[type] = (acc[type] || 0) + parseInt(log.milliliters)
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(stats).map(([type, amount]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    amount,
    percentage: ((amount / waterLogs.reduce((sum, log) => sum + parseInt(log.milliliters), 0)) * 100).toFixed(1)
  }))
}
