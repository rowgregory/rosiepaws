import { IWater } from '@/app/types'
import { Smile, Meh, Frown, Heart, AlertTriangle } from 'lucide-react'

export const calculateAverageMood = (data: Array<{ moodRating?: number }>): number => {
  if (!data || data.length === 0) {
    return 0
  }

  const totalMood = data.reduce((sum, item) => sum + (item?.moodRating || 0), 0)
  return Math.round(totalMood / data.length)
}

export const calculateTodaysAverageMood = (
  data: Array<{
    moodRating?: number
    timeRecorded?: Date | string
    createdAt?: Date | string
  }>
): number => {
  if (!data || data.length === 0) {
    return 0
  }

  const today = new Date().toLocaleDateString()

  const todaysData = data.filter((item) => {
    const itemDate = new Date(item.timeRecorded || item.createdAt || '').toLocaleDateString()
    return itemDate === today
  })

  return calculateAverageMood(todaysData)
}

export function getLocalISOString(date = new Date()) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

export const getQuickTimes = () => [
  { label: 'Just now', value: getLocalISOString(new Date()) },
  { label: '1 hour ago', value: getLocalISOString(new Date(Date.now() - 60 * 60 * 1000)) },
  { label: '2 hours ago', value: getLocalISOString(new Date(Date.now() - 2 * 60 * 60 * 1000)) },
  { label: '3 hours ago', value: getLocalISOString(new Date(Date.now() - 3 * 60 * 60 * 1000)) }
]

export const QUICK_TIMES = getQuickTimes()

export const getMoodEmoji = (rating: string) => {
  const moodRating = parseInt(rating)
  switch (moodRating) {
    case 1:
      return '😰'
    case 2:
      return '😔'
    case 3:
      return '😐'
    case 4:
      return '😊'
    case 5:
      return '🤗'
    default:
      return '😐'
  }
}

export const getMoodData = (rating: number) => {
  if (rating >= 4) {
    return {
      icon: Heart,
      label: 'Ecstatic',
      color: 'bg-green-100 text-green-800 border-green-200',
      iconColor: 'text-green-600'
    }
  } else if (rating >= 3) {
    return {
      icon: Smile,
      label: 'Happy',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconColor: 'text-emerald-600'
    }
  } else if (rating >= 2) {
    return {
      icon: Meh,
      label: 'Neutral',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      iconColor: 'text-yellow-600'
    }
  } else if (rating >= 1) {
    return {
      icon: Frown,
      label: 'Unhappy',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      iconColor: 'text-orange-600'
    }
  } else {
    return {
      icon: AlertTriangle,
      label: 'Distressed',
      color: 'bg-red-100 text-red-800 border-red-200',
      iconColor: 'text-red-600'
    }
  }
}

export const getMoodAnalysis = (waterLogs: IWater[]) => {
  const moodCounts = waterLogs.reduce(
    (acc, log) => {
      const mood = parseInt(log.moodRating)
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    },
    {} as Record<number, number>
  )

  const totalLogs = waterLogs.length
  const averageMood = waterLogs.reduce((sum, log) => sum + parseInt(log.moodRating), 0) / totalLogs

  return {
    averageMood: averageMood.toFixed(1),
    moodDistribution: Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood: parseInt(mood),
        count,
        percentage: ((count / totalLogs) * 100).toFixed(1)
      }))
      .sort((a, b) => a.mood - b.mood)
  }
}

export const getTimeOfDay = (timeString: string) => {
  const time = new Date(timeString)
  const hour = time.getHours()

  if (hour < 9) return '🌅 Morning'
  if (hour < 12) return '☀️ Mid-Morning'
  if (hour < 17) return '🌤️ Afternoon'
  if (hour < 20) return '🌆 Evening'
  return '🌙 Night'
}

export * from './blood-sugar'
export * from './date'
export * from './feeding'
export * from './medication'
export * from './pain'
export * from './walk'
export * from './water'
export * from './movement'
export * from './appointment'
export * from './seizure'
export * from './navigation'
export * from './dashboard'
