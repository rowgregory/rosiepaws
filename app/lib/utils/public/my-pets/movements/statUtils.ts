import { IMovement } from '@/app/types'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'

// Get recent movements (last 30 days, limited to 12 items)
export const getRecentMovements = (movements: IMovement[]): IMovement[] => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return movements
    .filter((movement) => new Date(movement.timeRecorded) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.timeRecorded).getTime() - new Date(a.timeRecorded).getTime())
    .slice(0, 12)
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
