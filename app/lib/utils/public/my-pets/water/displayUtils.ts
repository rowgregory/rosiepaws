import { DropletIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'

export const getWaterMoodDescription = (rating: number) => {
  const descriptions = [
    'Very reluctant to drink',
    'Hesitant to drink',
    'Normal drinking behavior',
    'Eager to drink',
    'Very enthusiastic about drinking'
  ]
  return descriptions[rating] || 'Select a mood'
}

// Helper function to get water intake configuration
export const getWaterIntakeConfig = (relativeIntake: string) => {
  const configs = {
    more: {
      icon: TrendingUpIcon,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'More Than Usual',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      description: 'Above normal water consumption'
    },
    normal: {
      icon: DropletIcon,
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Normal Amount',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      description: 'Typical water consumption'
    },
    less: {
      icon: TrendingDownIcon,
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Less Than Usual',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      description: 'Below normal water consumption'
    }
  }

  return configs[relativeIntake as keyof typeof configs] || configs.normal
}

export const getMoodColor = (rating: string) => {
  const moodRating = parseInt(rating)
  if (moodRating >= 4) return 'text-blue-600'
  if (moodRating >= 3) return 'text-green-600'
  if (moodRating >= 2) return 'text-yellow-600'
  if (moodRating >= 1) return 'text-orange-600'
  return 'text-red-600'
}

export const determineRelativeIntake = (currentMl: number, previousMl: number | null): string => {
  if (!previousMl) return 'normal' // Default to normal if no previous data

  if (currentMl > previousMl) return 'more'
  if (currentMl < previousMl) return 'less'
  return 'normal' // Equal amounts
}

export const getIntakeData = (relativeIntake: string) => {
  if (relativeIntake === 'more') return { color: 'bg-blue-100 text-blue-800', label: 'More' }
  if (relativeIntake === 'less') return { color: 'bg-red-100 text-red-800', label: 'Less' }
  return { color: 'bg-green-100 text-green-800', label: 'Normal' }
}
