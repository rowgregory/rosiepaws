import { isToday } from '@/app/lib/utils/date'
import { AlertCircle, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react'
import { BLOOD_SUGAR_RANGES } from '../constants/blood-sugar'
import { IBloodSugar } from '@/app/types'

export const getBloodSugarRange2 = (value: number) => {
  return BLOOD_SUGAR_RANGES.find((range) => value >= range.min && value <= range.max)
}

export const getTodaysBloodSugarLogs = (bloodSugars: any[]) => {
  if (!bloodSugars || bloodSugars?.length === 0) return []

  return bloodSugars.filter((reading) => {
    const readingDate = reading?.timeRecorded
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

export const isBloodSugarFormValid = (inputs: any) => {
  return inputs?.petId && inputs?.value && inputs?.timeRecorded
}

// Helper function to get blood sugar status based on value
export const getBloodSugarStatus = (value: number) => {
  // Normal range for dogs: 80-120 mg/dL
  // Normal range for cats: 70-150 mg/dL
  // Using general pet ranges here

  if (value < 70) {
    return {
      icon: TrendingDown,
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Low',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      description: 'Below normal range',
      priority: 'high'
    }
  } else if (value >= 70 && value <= 150) {
    return {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Normal',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      description: 'Within normal range',
      priority: 'normal'
    }
  } else if (value > 150 && value <= 200) {
    return {
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Elevated',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: 'Above normal range',
      priority: 'medium'
    }
  } else {
    return {
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'High',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      description: 'Significantly elevated',
      priority: 'high'
    }
  }
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

export const getReadingContext = (value: number) => {
  if (value < 50) return 'Emergency - Contact vet immediately'
  if (value < 80) return 'Monitor closely and contact vet if symptoms occur'
  if (value > 300) return 'Urgent veterinary attention needed'
  if (value > 200) return 'Veterinary consultation recommended'
  if (value > 150) return 'Monitor diet and medication timing'
  return 'Within normal range for dogs and cats'
}

export const getBloodSugarStats = (bloodSugarData: any[]) => {
  if (!bloodSugarData.length) return null

  const values = bloodSugarData.map((r) => Number(r.value))
  const latestReading = bloodSugarData[0]
  const latestValue = Number(latestReading?.value || 0)

  // Range analysis
  const criticalLow = values.filter((v) => v < 50).length
  const low = values.filter((v) => v >= 50 && v < 80).length
  const normal = values.filter((v) => v >= 80 && v <= 150).length
  const elevated = values.filter((v) => v > 150 && v <= 200).length
  const high = values.filter((v) => v > 200 && v <= 300).length
  const criticalHigh = values.filter((v) => v > 300).length

  // Meal relation analysis
  const mealStats = {
    FASTING: bloodSugarData.filter((r) => r.mealRelation === 'FASTING').length,
    BEFORE_MEAL: bloodSugarData.filter((r) => r.mealRelation === 'BEFORE_MEAL').length,
    AFTER_MEAL: bloodSugarData.filter((r) => r.mealRelation === 'AFTER_MEAL').length,
    BEDTIME: bloodSugarData.filter((r) => r.mealRelation === 'BEDTIME').length,
    RANDOM: bloodSugarData.filter((r) => r.mealRelation === 'RANDOM').length
  }

  // Medication correlation
  const withMedication = bloodSugarData.filter((r) => r.medicationGiven)
  const withoutMedication = bloodSugarData.filter((r) => !r.medicationGiven)
  const avgWithMed =
    withMedication.length > 0
      ? Math.round(withMedication.reduce((sum, r) => sum + Number(r.value), 0) / withMedication.length)
      : 0
  const avgWithoutMed =
    withoutMedication.length > 0
      ? Math.round(withoutMedication.reduce((sum, r) => sum + Number(r.value), 0) / withoutMedication.length)
      : 0

  // Symptoms analysis
  const readingsWithSymptoms = bloodSugarData.filter((r) => r.symptoms && r.symptoms !== 'None observed').length

  return {
    latestValue,
    latestStatus: getBloodSugarStatus(latestValue),
    average: Math.round(values.reduce((sum, v) => sum + v, 0) / values.length),
    min: Math.min(...values),
    max: Math.max(...values),
    total: bloodSugarData.length,
    outOfRange: criticalLow + low + elevated + high + criticalHigh,
    rangeBreakdown: { criticalLow, low, normal, elevated, high, criticalHigh },
    mealStats,
    medicationStats: {
      withMedication: withMedication.length,
      withoutMedication: withoutMedication.length,
      avgWithMed,
      avgWithoutMed
    },
    symptomsCount: readingsWithSymptoms
  }
}

export const getMealIcon = (mealRelation: string) => {
  switch (mealRelation) {
    case 'FASTING':
      return '🌅'
    case 'BEFORE_MEAL':
      return '🍽️'
    case 'AFTER_MEAL':
      return '🍴'
    case 'BEDTIME':
      return '🌙'
    case 'RANDOM':
      return '🔄'
    default:
      return '📊'
  }
}
