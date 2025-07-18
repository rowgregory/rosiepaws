import { IWalk } from '../../types/entities'

export const getWalkMoodDescription = (rating: number) => {
  switch (rating) {
    case 0:
    case undefined:
    case null:
      return 'How was their mood on the walk?'
    case 1:
      return 'Dragging behind, not interested'
    case 2:
      return 'Calm and steady'
    case 3:
      return 'Alert and engaged'
    case 4:
      return 'Bouncing with excitement!'
    default:
      return 'How was their mood on the walk?'
  }
}

// Helper function to get pace color
export const getPaceColor = (pace: string) => {
  const paceValue = pace.toLowerCase()
  if (paceValue.includes('fast') || paceValue.includes('brisk')) {
    return 'bg-orange-100 text-orange-800 border-orange-200'
  } else if (paceValue.includes('moderate') || paceValue.includes('normal')) {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  } else {
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

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

export const isWalkFormValid = (inputs: any) => {
  return (
    inputs?.petId &&
    inputs?.distance &&
    inputs?.duration &&
    inputs?.pace &&
    inputs?.distraction &&
    inputs?.moodRating !== undefined &&
    inputs?.timeRecorded
  )
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
