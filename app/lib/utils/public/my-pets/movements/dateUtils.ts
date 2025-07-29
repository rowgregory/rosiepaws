import { IMovement } from '@/app/types'

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
