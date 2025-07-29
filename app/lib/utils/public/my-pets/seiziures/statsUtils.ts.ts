import { ISeizure } from '@/app/types'

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
