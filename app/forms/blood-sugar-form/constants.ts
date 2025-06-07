import { isToday } from '@/app/lib/utils/date'
import { AlertCircle, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

export const BLOOD_SUGAR_RANGES = [
  { min: 50, max: 79, label: 'Low (50-79)', color: 'bg-red-50 border-red-300 text-red-700', emoji: '⬇️' },
  { min: 80, max: 120, label: 'Normal (80-120)', color: 'bg-green-50 border-green-300 text-green-700', emoji: '✅' },
  {
    min: 121,
    max: 180,
    label: 'Elevated (121-180)',
    color: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    emoji: '⚠️'
  },
  { min: 181, max: 300, label: 'High (181-300)', color: 'bg-orange-50 border-orange-300 text-orange-700', emoji: '⬆️' },
  { min: 301, max: 999, label: 'Very High (300+)', color: 'bg-red-50 border-red-300 text-red-700', emoji: '🚨' }
]

export const getBloodSugarRange2 = (value: number) => {
  return BLOOD_SUGAR_RANGES.find((range) => value >= range.min && value <= range.max)
}

export const getTodaysBloodSugarLogs = (bloodSugars: any[]) => {
  if (!bloodSugars || bloodSugars?.length === 0) return []

  return bloodSugars.filter((reading) => {
    const readingDate = reading?.timeTaken
    return isToday(readingDate)
  })
}

export const parseBloodSugarValue = (value: any): number => {
  if (value === null || value === undefined || value === '') return 0
  const parsed = parseInt(String(value))
  return isNaN(parsed) ? 0 : parsed
}

export const getBloodSugarRange = (value: string) => {
  const numValue = parseInt(value)
  if (numValue < 80)
    return {
      color: 'bg-red-50 border-red-300 text-red-700',
      icon: AlertTriangle,
      label: 'Low',
      bgGradient: 'from-red-500 to-red-600',
      severity: 'critical'
    }
  if (numValue <= 120)
    return {
      color: 'bg-green-50 border-green-300 text-green-700',
      icon: CheckCircle,
      label: 'Normal',
      bgGradient: 'from-green-500 to-green-600',
      severity: 'good'
    }
  if (numValue <= 180)
    return {
      color: 'bg-yellow-50 border-yellow-300 text-yellow-700',
      icon: AlertCircle,
      label: 'Elevated',
      bgGradient: 'from-yellow-500 to-yellow-600',
      severity: 'warning'
    }
  if (numValue <= 300)
    return {
      color: 'bg-orange-50 border-orange-300 text-orange-700',
      icon: TrendingUp,
      label: 'High',
      bgGradient: 'from-orange-500 to-orange-600',
      severity: 'high'
    }
  return {
    color: 'bg-red-50 border-red-300 text-red-700',
    icon: AlertTriangle,
    label: 'Very High',
    bgGradient: 'from-red-600 to-red-700',
    severity: 'critical'
  }
}
