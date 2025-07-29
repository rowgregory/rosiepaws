import { IWalk } from '@/app/types'

// Helper function to get today's walks
export const getTodaysWalks = (walks: any[]) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return walks.filter((walk) => {
    const walkDate = new Date(walk?.createdAt)
    walkDate.setHours(0, 0, 0, 0)
    return walkDate.getTime() === today.getTime()
  })
}

export const getDistanceMiles = (distance: string): number => {
  const miles = parseInt(distance)
  return isNaN(miles) ? 0 : miles
}

// Helper function to get distance config
export const getDurationMinutes = (duration: string): number => {
  const minutes = parseInt(duration)
  return isNaN(minutes) ? 0 : minutes
}

// Calculate total distance for multiple walks
export const calculateTotalDistance = (walks: IWalk[]): number => {
  return walks.reduce((total, walk) => {
    return total + getDistanceMiles(walk.distance)
  }, 0)
}

// Calculate today's total distance
export const getTodaysTotalDistance = (walks: IWalk[]): number => {
  const today = new Date().toLocaleDateString()
  const todaysWalks = walks.filter((walk) => {
    const walkDate = new Date(walk.timeRecorded).toLocaleDateString()
    return walkDate === today
  })
  return calculateTotalDistance(todaysWalks)
}

// Calculate weekly total distance
export const getWeeklyTotalDistance = (walks: IWalk[]): number => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const weekWalks = walks.filter((walk) => {
    return new Date(walk.timeRecorded) >= weekAgo
  })
  return calculateTotalDistance(weekWalks)
}

export const calculatePace = (distance: string, duration: string): number => {
  const miles = getDistanceMiles(distance)
  const minutes = getDurationMinutes(duration)
  return miles > 0 ? minutes / miles : 0
}

// Filter walks based on time range
export const getFilteredWalks = (walks: IWalk[], timeRange: string) => {
  if (!walks?.length) return []

  const now = new Date()
  const sortedWalks = [...walks].sort((a, b) => new Date(a.timeRecorded).getTime() - new Date(b.timeRecorded).getTime())

  switch (timeRange) {
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return sortedWalks.filter((walk) => new Date(walk.timeRecorded) >= weekAgo)
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return sortedWalks.filter((walk) => new Date(walk.timeRecorded) >= monthAgo)
    default:
      return sortedWalks
  }
}
