import { ISeizure } from '@/app/types'
import { AlertCircle, AlertTriangle, Clock, Shield, Zap } from 'lucide-react'
import { SeizureSeverity } from '../constants'

// Helper function to get today's seizures
export const getTodaysSeizures = (seizures: ISeizure[]) => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  return seizures.filter((seizure) => {
    const seizureDate = new Date(seizure.timeRecorded)
    return seizureDate >= startOfDay && seizureDate < endOfDay
  })
}

// Helper function to get recent seizures within specified days
export const getRecentSeizures = (seizures: ISeizure[], days: number) => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return seizures.filter((seizure) => {
    const seizureDate = new Date(seizure.timeRecorded)
    return seizureDate >= cutoffDate
  })
}

// Helper function to format duration from seconds
export const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds}s`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
}

// Helper function to calculate seizure frequency and patterns
export const getSeizureFrequency = (seizures: ISeizure[]) => {
  if (seizures.length === 0) {
    return {
      perMonth: 0,
      perWeek: 0,
      averageDuration: null,
      daysSinceLastSeizure: 0,
      longestInterval: 0,
      shortestInterval: 0
    }
  }

  const sortedSeizures = [...seizures].sort(
    (a, b) => new Date(b.timeRecorded).getTime() - new Date(a.timeRecorded).getTime()
  )

  const now = new Date()
  const firstSeizure = new Date(sortedSeizures[sortedSeizures.length - 1].timeRecorded)
  const lastSeizure = new Date(sortedSeizures[0].timeRecorded)

  const totalDays = Math.max(1, (now.getTime() - firstSeizure.getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceLastSeizure = Math.floor((now.getTime() - lastSeizure.getTime()) / (1000 * 60 * 60 * 24))

  const perMonth = (seizures.length / totalDays) * 30
  const perWeek = (seizures.length / totalDays) * 7

  // Calculate average duration for seizures with recorded duration
  const seizuresWithDuration = seizures.filter((s) => s.duration)
  const averageDuration =
    seizuresWithDuration.length > 0
      ? formatDuration(
          Math.round(seizuresWithDuration.reduce((sum, s) => sum + s.duration!, 0) / seizuresWithDuration.length)
        )
      : null

  // Calculate intervals between seizures
  const intervals: number[] = []
  for (let i = 0; i < sortedSeizures.length - 1; i++) {
    const current = new Date(sortedSeizures[i].timeRecorded)
    const next = new Date(sortedSeizures[i + 1].timeRecorded)
    const intervalDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    intervals.push(intervalDays)
  }

  const longestInterval = intervals.length > 0 ? Math.max(...intervals) : 0
  const shortestInterval = intervals.length > 0 ? Math.min(...intervals) : 0

  return {
    perMonth,
    perWeek,
    averageDuration,
    daysSinceLastSeizure,
    longestInterval: Math.round(longestInterval),
    shortestInterval: Math.round(shortestInterval)
  }
}

// Helper function to determine seizure severity based on duration
export const getSeizureSeverity = (duration?: number) => {
  if (!duration) {
    return {
      icon: Clock,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      label: 'Unknown',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-900',
      description: 'Duration not recorded',
      priority: 'unknown'
    }
  }

  if (duration < 30) {
    return {
      icon: Shield,
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Brief',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      description: 'Short duration seizure',
      priority: 'low'
    }
  } else if (duration <= 120) {
    // 2 minutes
    return {
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Moderate',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: 'Moderate duration seizure',
      priority: 'medium'
    }
  } else if (duration <= 300) {
    // 5 minutes
    return {
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      label: 'Extended',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-900',
      description: 'Extended duration seizure',
      priority: 'high'
    }
  } else {
    return {
      icon: Zap,
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Emergency',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      description: 'Emergency - requires immediate attention',
      priority: 'critical'
    }
  }
}

export const getEmergencyLevel = (duration?: number) => {
  if (!duration) return { level: 'Monitor', color: 'text-gray-600' }
  if (duration < 30) return { level: 'Normal', color: 'text-green-600' }
  if (duration <= 120) return { level: 'Monitor closely', color: 'text-yellow-600' }
  if (duration <= 300) return { level: 'Contact vet', color: 'text-orange-600' }
  return { level: 'EMERGENCY', color: 'text-red-600' }
}

export const isSeizureFormValid = (inputs: any) => {
  return inputs?.petId && inputs?.timeRecorded && inputs?.duration
}

export const formatDateReadable = (dateString: string) => {
  const date = new Date(dateString)
  // Adjust for potential timezone issues by using UTC methods
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

// Utility function to format date
export const formatSeizureDate = (date: Date, format: 'yyyy-MM-dd' | 'MMMM yyyy' | 'd' = 'yyyy-MM-dd') => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  switch (format) {
    case 'MMMM yyyy':
      return `${months[date.getMonth()]} ${date.getFullYear()}`
    case 'd':
      return date.getDate().toString()
    case 'yyyy-MM-dd':
    default:
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
}

// Get calendar days for a month
export const getCalendarDays = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: Date[] = []

  // Add days from previous month if first day is not Sunday
  const startingDayOfWeek = firstDay.getDay()
  if (startingDayOfWeek > 0) {
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push(prevMonthDay)
    }
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }

  // Add days to complete the week grid
  const totalDays = days.length
  const remainingDays = 42 - totalDays // 6 rows * 7 columns
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDay = new Date(year, month + 1, i)
    days.push(nextMonthDay)
  }

  return days
}

// Get background color based on seizure severity
export const getSeverityColor: any = (severity?: SeizureSeverity) => {
  switch (severity) {
    case SeizureSeverity.MILD:
      return 'bg-yellow-100'
    case SeizureSeverity.MODERATE:
      return 'bg-amber-100'
    case SeizureSeverity.SEVERE:
      return 'bg-orange-200'
    case SeizureSeverity.CRITICAL:
      return 'bg-red-200'
    default:
      return 'bg-white'
  }
}

// Navigate between months
export const changeMonth = (direction: 'prev' | 'next', setCurrentDate: any) => {
  setCurrentDate((prev: any) => {
    const newDate = new Date(prev)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    return newDate
  })
}

export const calculateDotSize = (duration: number) => {
  // More conservative scaling
  const minSize = 3
  const maxSize = 10
  const normalizedDuration = Math.min(duration || 0, 300) // Cap at 300 seconds, handle undefined

  // Linear scaling
  return minSize + (maxSize - minSize) * (normalizedDuration / 300)
}

// Process seizure data for scatter plot
export const processedSeizureData = (seizures: any) => {
  const reversedSeizures = seizures ? [...seizures].reverse() : []
  const safeSeizures = Array.isArray(reversedSeizures) ? reversedSeizures : []

  return safeSeizures
    .map((seizure: any) => {
      // Handle potential undefined or malformed date
      let seizureDate = new Date()

      if (seizure.date) {
        const [month, day, year] = seizure.date.split('/')
        seizureDate = new Date(year, month - 1, day)
      }

      // Calculate dot size based on duration
      const calculateDotSize = (duration: number) => {
        // More conservative scaling
        const minSize = 3
        const maxSize = 10
        const normalizedDuration = Math.min(duration || 0, 300) // Cap at 300 seconds, handle undefined

        // Linear scaling
        return minSize + (maxSize - minSize) * (normalizedDuration / 300)
      }

      return {
        ...seizure,
        x: seizureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: seizure.duration || 0,
        z: calculateDotSize(seizure.duration || 0), // Size of the dot based on duration
        originalDuration: seizure.duration || 0 // Keep original duration for tooltip
      }
    })
    .filter((seizure: any) => {
      // Filter for last 7 days
      const seizureDate = new Date(seizure.date)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return seizureDate >= sevenDaysAgo
    })
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
