import { useState } from 'react'
import {
  ResponsiveContainer,
  Tooltip,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Area
} from 'recharts'
import { Navigation, Users, Clock, MapPin, Zap, Heart } from 'lucide-react'

// Activity Level enum mapping
const ActivityLevel = {
  VERY_LOW: 1,
  LOW: 2,
  MODERATE: 3,
  HIGH: 4,
  VERY_HIGH: 5
}

const ActivityLevelLabels = {
  VERY_LOW: 'Very Low',
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  VERY_HIGH: 'Very High'
}

// Energy Level enum mapping
const EnergyLevel = {
  EXHAUSTED: 1,
  TIRED: 2,
  NORMAL: 3,
  ENERGETIC: 4,
  HYPERACTIVE: 5
}

const LargeMovementsGraph = ({ movements }: any) => {
  const [timeRange] = useState('14days') // Fixed to 14 days
  const [viewType] = useState('daily') // daily, weekly, monthly

  if (movements?.length === 0 || movements === null || movements === undefined) return

  // Helper function to convert activity level enum to number
  const getActivityLevelValue = (activityLevel: string | number) => {
    if (typeof activityLevel === 'number') return activityLevel
    return ActivityLevel[activityLevel as keyof typeof ActivityLevel] || 3
  }

  // Helper function to convert activity level number back to label
  const getActivityLevelLabel = (value: number) => {
    const enumKey = Object.keys(ActivityLevel).find(
      (key) => ActivityLevel[key as keyof typeof ActivityLevel] === Math.round(value)
    )
    return enumKey ? ActivityLevelLabels[enumKey as keyof typeof ActivityLevelLabels] : 'Moderate'
  }

  // Helper function to convert energy level enum to number
  const getEnergyLevelValue = (energyLevel: string | number) => {
    if (typeof energyLevel === 'number') return energyLevel
    return EnergyLevel[energyLevel as keyof typeof EnergyLevel] || 3
  }

  // Filter movements based on time range
  const filterMovementsByRange = (movements: any[]) => {
    const now = new Date()
    const ranges = {
      '14days': 14
    }

    const daysBack = ranges[timeRange as keyof typeof ranges]
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
    return movements.filter((movement: any) => new Date(movement.date) >= cutoffDate)
  }

  const filteredMovements = filterMovementsByRange(movements)

  // Group data by time period
  const groupMovementsByPeriod = () => {
    const grouped = filteredMovements.reduce((acc: any, movement: any) => {
      const date = new Date(movement.date)
      let key = ''

      if (viewType === 'daily') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }

      if (!acc[key]) {
        acc[key] = {
          period: key,
          totalDuration: 0,
          totalDistance: 0,
          sessionCount: 0,
          avgActivityLevel: 0,
          avgEnthusiasm: 0,
          avgEnergyChange: 0,
          indoorSessions: 0,
          outdoorSessions: 0,
          movementTypes: {},
          totalActivityLevel: 0,
          totalEnthusiasm: 0,
          totalEnergyChange: 0
        }
      }

      const entry = acc[key]
      entry.totalDuration += movement.durationMinutes || 0
      entry.totalDistance += movement.distanceMeters || 0 // distanceMeters is actually miles
      entry.sessionCount += 1
      entry.totalActivityLevel += getActivityLevelValue(movement.activityLevel)
      entry.totalEnthusiasm += movement.enthusiasm || 5
      const energyAfter = getEnergyLevelValue(movement.energyAfter ?? 'NORMAL')
      const energyBefore = getEnergyLevelValue(movement.energyBefore ?? 'NORMAL')
      entry.totalEnergyChange += energyAfter - energyBefore

      if (movement.indoor) {
        entry.indoorSessions += 1
      } else {
        entry.outdoorSessions += 1
      }

      const movementType = movement.movementType || 'walk'
      entry.movementTypes[movementType] = (entry.movementTypes[movementType] || 0) + 1

      return acc
    }, {})

    // Calculate averages
    Object.values(grouped).forEach((entry: any) => {
      entry.avgActivityLevel = entry.totalActivityLevel / entry.sessionCount
      entry.avgEnthusiasm = entry.totalEnthusiasm / entry.sessionCount
      entry.avgEnergyChange = entry.totalEnergyChange / entry.sessionCount
    })

    return Object.values(grouped).sort((a: any, b: any) => {
      return new Date(a.period).getTime() - new Date(b.period).getTime()
    })
  }

  const chartData = groupMovementsByPeriod()

  // Calculate summary stats
  const totalSessions = filteredMovements.length
  const totalDuration = filteredMovements.reduce((sum: number, m: any) => sum + (m.durationMinutes || 0), 0)
  const totalDistance = filteredMovements.reduce((sum: number, m: any) => sum + (m.distanceMeters || 0), 0)
  const avgActivityLevel =
    filteredMovements.reduce((sum: number, m: any) => sum + getActivityLevelValue(m.activityLevel), 0) / totalSessions
  const avgEnthusiasm = filteredMovements.reduce((sum: number, m: any) => sum + (m.enthusiasm || 5), 0) / totalSessions

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-64">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Sessions: {data.sessionCount}</p>
            <p className="text-green-600">Duration: {data.totalDuration} min</p>
            <p className="text-purple-600">Distance: {data.totalDistance.toFixed(1)} mi</p>
            <p className="text-orange-600">
              Avg Activity: {getActivityLevelLabel(data.avgActivityLevel)} ({data.avgActivityLevel.toFixed(1)}/5)
            </p>
            <p className="text-pink-600">Avg Enthusiasm: {data.avgEnthusiasm.toFixed(1)}/10</p>
            <p className="text-cyan-600">
              Energy Change: {data.avgEnergyChange > 0 ? '+' : ''}
              {data.avgEnergyChange.toFixed(1)}
            </p>
            <p className="text-gray-600">
              Indoor: {data.indoorSessions} | Outdoor: {data.outdoorSessions}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-gray-500 rounded-lg">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Movement Analytics</h3>
            <p className="text-sm text-gray-500">Comprehensive activity tracking</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-2 lg:mt-0 lg:text-right">
          <div className="text-2xl font-bold text-cyan-600">
            {filteredMovements.length > 0 ? filteredMovements[filteredMovements.length - 1]?.durationMinutes || 0 : 0}
            min
          </div>
          <div className="text-sm text-gray-500">Latest Session</div>
          <div className="text-xs text-gray-400 mt-1">Target: 30min/day</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Duration (min) / Distance (mi)',
              angle: -90,
              position: 'insideCenter'
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Sessions', angle: 90, position: 'insideRight' }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Bar yAxisId="right" dataKey="sessionCount" fill="url(#sessionGradient)" name="Sessions" />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="totalDuration"
            fill="url(#durationGradient)"
            stroke="#10b981"
            name="Duration (min)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="totalDistance"
            stroke="#8b5cf6"
            strokeWidth={3}
            name="Distance (mi)"
          />

          <defs>
            <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
              <stop offset="100%" stopColor="#f3f4f6" stopOpacity={1} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center p-3 bg-cyan-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-cyan-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-cyan-600">{totalSessions}</div>
          <div className="text-xs text-gray-600">Total Sessions</div>
        </div>
        <div className="text-center p-3 bg-teal-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-teal-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-teal-600">{totalDuration}min</div>
          <div className="text-xs text-gray-600">Total Duration</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <MapPin className="w-4 h-4 text-slate-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-slate-600">{totalDistance.toFixed(1)}mi</div>
          <div className="text-xs text-gray-600">Total Distance</div>
        </div>
        <div className="text-center p-3 bg-stone-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Zap className="w-4 h-4 text-stone-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-stone-600">{getActivityLevelLabel(avgActivityLevel)}</div>
          <div className="text-xs text-gray-600">Avg Activity</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Heart className="w-4 h-4 text-gray-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-gray-600">{avgEnthusiasm.toFixed(1)}/10</div>
          <div className="text-xs text-gray-600">Avg Enthusiasm</div>
        </div>
      </div>
    </div>
  )
}

export default LargeMovementsGraph
