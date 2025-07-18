import { IMovement } from '@/app/types'
import { Activity, Heart, HelpingHand, LifeBuoy, Minus, TrendingDown, TrendingUp, Zap } from 'lucide-react'

// Get recent movements (last 30 days, limited to 12 items)
export const getRecentMovements = (movements: IMovement[]): IMovement[] => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return movements
    .filter((movement) => new Date(movement.timeRecorded) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.timeRecorded).getTime() - new Date(a.timeRecorded).getTime())
    .slice(0, 12)
}

// Get today's movements
export const getTodaysMovements = (movements: IMovement[]): IMovement[] => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  return movements
    .filter((movement) => {
      const movementDate = new Date(movement.timeRecorded)
      return movementDate >= startOfDay && movementDate < endOfDay
    })
    .sort((a, b) => new Date(b.timeRecorded).getTime() - new Date(a.timeRecorded).getTime())
}

// Get weekly movement statistics
export const getWeeklyMovementStats = (movements: IMovement[]) => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const weeklyMovements = movements.filter((movement) => new Date(movement.timeRecorded) >= oneWeekAgo)

  const totalSessions = weeklyMovements.length
  const totalMinutes = weeklyMovements.reduce((sum, movement) => sum + (movement.durationMinutes || 0), 0)

  // Create daily breakdown for the last 7 days
  const dailyBreakdown = []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const dayMovements = movements.filter((movement) => {
      const movementDate = new Date(movement.timeRecorded)
      return movementDate.toDateString() === date.toDateString()
    })

    const dayMinutes = dayMovements.reduce((sum, movement) => sum + (movement.durationMinutes || 0), 0)

    dailyBreakdown.push({
      day: days[date.getDay()],
      date: date.toDateString(),
      minutes: dayMinutes,
      sessions: dayMovements.length
    })
  }

  return {
    totalSessions,
    totalMinutes,
    dailyBreakdown,
    averageDaily: Math.round(totalMinutes / 7)
  }
}

// Get movements grouped by type with counts
export const getMovementsByType = (movements: IMovement[]) => {
  const typeCounts: { [key: string]: number } = {}

  movements.forEach((movement) => {
    const type = movement.movementType || 'UNKNOWN'
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })

  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      type: type.replace('_', ' ').toLowerCase(),
      count,
      percentage: Math.round((count / movements.length) * 100)
    }))
    .sort((a, b) => b.count - a.count)
}

// Get average activity level
export const getAverageActivity = (movements: IMovement[]): string => {
  if (!movements.length) return 'No data'

  const activityValues: { [key: string]: number } = {
    VERY_LOW: 1,
    LOW: 2,
    MODERATE: 3,
    HIGH: 4,
    VERY_HIGH: 5
  }

  const validMovements = movements.filter((m) => m.activityLevel && activityValues[m.activityLevel])

  if (!validMovements.length) return 'No data'

  const totalActivity = validMovements.reduce((sum, movement) => sum + activityValues[movement.activityLevel!], 0)

  const average = totalActivity / validMovements.length

  if (average <= 1.5) return 'Very Low'
  if (average <= 2.5) return 'Low'
  if (average <= 3.5) return 'Moderate'
  if (average <= 4.5) return 'High'
  return 'Very High'
}

export const getMovementTypeIcon = (type: string) => {
  switch (type) {
    case 'WALK':
      return { icon: Activity, color: 'text-blue-500' }
    case 'RUN':
      return { icon: Zap, color: 'text-green-500' }
    case 'SWIM':
      return { icon: Activity, color: 'text-cyan-500' }
    case 'PHYSICAL_THERAPY':
      return { icon: Heart, color: 'text-purple-500' }
    case 'WHEELCHAIR_MOBILITY':
      return { icon: LifeBuoy, color: 'text-orange-500' }
    case 'ASSISTED_WALKING':
      return { icon: HelpingHand, color: 'text-indigo-500' }
    default:
      return { icon: Activity, color: 'text-gray-500' }
  }
}

// Get activity level color
export const getActivityLevelColor = (level: string) => {
  switch (level) {
    case 'VERY_LOW':
      return 'bg-gray-100 text-gray-600 border-gray-200'
    case 'LOW':
      return 'bg-blue-100 text-blue-600 border-blue-200'
    case 'MODERATE':
      return 'bg-yellow-100 text-yellow-600 border-yellow-200'
    case 'HIGH':
      return 'bg-orange-100 text-orange-600 border-orange-200'
    case 'VERY_HIGH':
      return 'bg-red-100 text-red-600 border-red-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export const getPainTrend = (movement: IMovement) => {
  if (!movement.painBefore || !movement.painAfter) return null

  const before = movement.painBefore
  const after = movement.painAfter

  if (after < before) return { icon: TrendingDown, color: 'text-green-500', label: 'Pain decreased' }
  if (after > before) return { icon: TrendingUp, color: 'text-red-500', label: 'Pain increased' }
  return { icon: Minus, color: 'text-gray-500', label: 'Pain unchanged' }
}

export const getEnergyTrend = (movement: IMovement) => {
  if (!movement.energyBefore || !movement.energyAfter) return null

  const energyValues: { [key: string]: number } = {
    EXHAUSTED: 1,
    TIRED: 2,
    NORMAL: 3,
    ENERGETIC: 4,
    HYPERACTIVE: 5
  }

  const before = energyValues[movement.energyBefore]
  const after = energyValues[movement.energyAfter]

  if (after > before) return { icon: TrendingUp, color: 'text-green-500', label: 'Energy improved' }
  if (after < before) return { icon: TrendingDown, color: 'text-red-500', label: 'Energy declined' }
  return { icon: Minus, color: 'text-gray-500', label: 'Energy unchanged' }
}

// Check for concerning signs
export const getConcerningSigns = (movement: IMovement) => {
  const signs = []
  if (movement.limping) signs.push('Limping')
  if (movement.reluctance) signs.push('Reluctant')
  if (movement.panting === 'HEAVY' || movement.panting === 'EXCESSIVE') signs.push('Heavy panting')
  if (movement.gaitQuality === 'SEVERE_LIMP' || movement.gaitQuality === 'UNABLE_TO_WALK') signs.push('Gait issues')
  return signs
}

export const isMovementFormValid = (inputs: any): boolean => {
  return !!(
    inputs?.petId &&
    inputs?.movementType &&
    inputs?.activityLevel &&
    inputs?.timeRecorded &&
    inputs?.energyBefore &&
    inputs?.energyAfter &&
    inputs?.mobility &&
    inputs?.timeRecorded
  )
}
