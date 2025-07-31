import { IWater } from '@/app/types'
import { Smile, Meh, Frown, Heart, AlertTriangle } from 'lucide-react'

export const getMoodEmoji = (rating: string) => {
  const moodRating = parseInt(rating)
  switch (moodRating) {
    case 0:
      return '😴'
    case 1:
      return '😐'
    case 2:
      return '🙂'
    case 3:
      return '😋'
    case 4:
      return '🤤'

    default:
      return '🤗'
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
