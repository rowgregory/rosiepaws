import { AlertCircle, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react'

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

export const getReadingContext = (value: number) => {
  if (value < 50) return 'Emergency - Contact vet immediately'
  if (value < 80) return 'Monitor closely and contact vet if symptoms occur'
  if (value > 300) return 'Urgent veterinary attention needed'
  if (value > 200) return 'Veterinary consultation recommended'
  if (value > 150) return 'Monitor diet and medication timing'
  return 'Within normal range for dogs and cats'
}
