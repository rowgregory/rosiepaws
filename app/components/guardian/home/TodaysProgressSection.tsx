import { BarChart3, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

// Function to calculate today's progress metrics
const calculateTodaysProgress = ({ movements = [], waters = [], feedings = [], painScores = [], pets = [] }) => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  // Helper function to check if date is today
  const isToday = (date: string | number | Date) => {
    const checkDate = new Date(date)
    return checkDate >= startOfDay && checkDate < endOfDay
  }

  // 1. Pain Monitoring Consistency
  const calculatePainMonitoring = () => {
    const todayPainScores = painScores.filter((score: any) => isToday(score.createdAt))

    // For pets with chronic conditions, pain should be monitored 2-3 times daily
    const expectedPainChecks = 3
    const actualPainChecks = todayPainScores.length

    const consistency = Math.min((actualPainChecks / expectedPainChecks) * 100, 100)
    return Math.round(consistency)
  }

  // 2. Daily Activity Goal
  const calculateActivityProgress = () => {
    const todayMovements = movements.filter((movement: { createdAt: any }) => isToday(movement.createdAt))
    const pet: any = pets[0]

    // Calculate total movement time in minutes
    const totalMovementTime = todayMovements.reduce((total: any, movement: { duration: any }) => {
      return total + (movement.duration || 15) // Default 15 minutes if no duration
    }, 0)

    // Activity goal based on pet type and age
    const getActivityGoal = () => {
      if (pet?.type === 'dog') {
        return pet.age > 10 ? 30 : 60 // Senior dogs need less activity
      } else if (pet?.type === 'cat') {
        return pet.age > 12 ? 15 : 30 // Senior cats need minimal activity
      }
      return 45 // Default goal in minutes
    }

    const activityGoal = getActivityGoal()
    const progress = Math.min((totalMovementTime / activityGoal) * 100, 100)
    return Math.round(progress)
  }

  // 3. Hydration Target
  const calculateHydrationProgress = () => {
    const todayWater = waters.filter((water: { createdAt: any }) => isToday(water.createdAt))
    const pet: any = pets[0]

    // Calculate total water intake
    const totalWaterIntake = todayWater.reduce((total: number, water: { milliliters: any }) => {
      return total + Number(water.milliliters || 0)
    }, 0)

    // Daily water goal based on pet weight (rough estimate: 60ml per kg for dogs, 50ml per kg for cats)
    const getHydrationGoal = () => {
      const weight = Number(pet?.weight) || 20 // Default 20kg
      const multiplier = pet?.type === 'cat' ? 50 : 60
      return weight * multiplier
    }

    const hydrationGoal = getHydrationGoal()
    const progress = Math.min((totalWaterIntake / hydrationGoal) * 100, 100)

    return Math.round(progress)
  }

  // 4. Feeding Schedule Adherence
  const calculateFeedingAdherence = () => {
    const todayFeedings = feedings.filter((feeding: { createdAt: any }) => isToday(feeding.createdAt))
    const pet: any = pets[0]

    // Expected meals based on pet type and health condition
    const getExpectedMeals = () => {
      if (pet?.type === 'cat') {
        return 3 // Cats typically eat 3 small meals
      } else if (pet?.type === 'dog') {
        return pet.age > 10 ? 3 : 2 // Senior dogs often need more frequent, smaller meals
      }
      return 3 // Default
    }

    const expectedMeals = getExpectedMeals()
    const actualMeals = todayFeedings.length

    const adherence = Math.min((actualMeals / expectedMeals) * 100, 100)
    return Math.round(adherence)
  }

  return {
    painMonitoring: calculatePainMonitoring(),
    activityProgress: calculateActivityProgress(),
    hydrationProgress: calculateHydrationProgress(),
    feedingAdherence: calculateFeedingAdherence()
  }
}

// Updated Progress Component
const TodaysProgressSection = ({ waters, feedings, painScores, pets }: any) => {
  const progress = calculateTodaysProgress({
    waters,
    feedings,
    painScores,
    pets
  })
  const [showExplanation, setShowExplanation] = useState(false)
  const progressItems = [
    {
      label: 'Pain Monitoring',
      value: progress.painMonitoring,
      color: 'bg-red-600',
      description: 'Regular pain assessments throughout the day'
    },
    {
      label: 'Daily Activity Goal',
      value: progress.activityProgress,
      color: 'bg-green-600',
      description: 'Exercise and movement targets'
    },
    {
      label: 'Hydration Target',
      value: progress.hydrationProgress,
      color: 'bg-cyan-600',
      description: 'Daily water intake goals'
    },
    {
      label: 'Feeding Schedule',
      value: progress.feedingAdherence,
      color: 'bg-orange-600',
      description: 'Meal timing and frequency adherence'
    }
  ]

  return (
    <div className="bg-white lg:rounded-lg lg:shadow-sm border border-t-gray-200 border-b-gray-200 lg:border-gray-200 p-4 lg:p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Progress</h2>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {progressItems.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${item.value}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          </div>
        ))}

        {/* Collapsible Progress Calculation Explanation */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="group flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <span className="text-xs font-medium text-gray-600">How are these percentages calculated?</span>
            <ChevronRight
              className={`w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${
                showExplanation ? 'transform rotate-90' : ''
              }`}
            />
          </button>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-2 text-xs text-gray-500 overflow-hidden"
            >
              <div className="p-2 bg-gray-50 rounded border-l-2 border-red-300">
                <strong className="text-red-700">Pain Monitoring:</strong> Based on 3 pain assessments per day (morning,
                afternoon, evening) for optimal comfort management.
              </div>
              <div className="p-2 bg-gray-50 rounded border-l-2 border-green-300">
                <strong className="text-green-700">Activity Goal:</strong> Senior pets (10+ years): 30 min/day for dogs,
                15 min/day for cats. Younger pets need 60 min/day (dogs) or 30 min/day (cats).
              </div>
              <div className="p-2 bg-gray-50 rounded border-l-2 border-cyan-300">
                <strong className="text-cyan-700">Hydration Target:</strong> Calculated as 60ml per kg body weight for
                dogs, 50ml per kg for cats (veterinary standard).
              </div>
              <div className="p-2 bg-gray-50 rounded border-l-2 border-orange-300">
                <strong className="text-orange-700">Feeding Schedule:</strong> Based on 3 meals per day for optimal
                medication absorption and blood sugar stability.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodaysProgressSection
