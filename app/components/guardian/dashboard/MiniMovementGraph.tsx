import React from 'react'
import { ResponsiveContainer, Tooltip, RadialBarChart, RadialBar, PolarAngleAxis, Legend } from 'recharts'
import { Navigation } from 'lucide-react'

const MiniMovementsGraph = ({ movements }: any) => {
  if (movements?.length === 0 || movements === null || movements === undefined) return null

  // Calculate total duration for today
  const today = new Date().toDateString()
  const totalDurationToday =
    movements
      ?.filter((movement: any) => new Date(movement.timeRecorded).toDateString() === today)
      ?.reduce((total: number, movement: any) => total + (movement.durationMinutes || 0), 0) || 0

  // Sort movements chronologically
  const sortedMovements =
    movements?.sort((a: any, b: any) => {
      return new Date(a.timeRecorded).getTime() - new Date(b.timeRecorded).getTime()
    }) || []

  // Group movements by type and calculate metrics
  const movementTypes = sortedMovements.reduce((acc: any, movement: any) => {
    const type = movement.movementType || 'walk'
    if (!acc[type]) {
      acc[type] = {
        name: type,
        count: 0,
        totalDuration: 0,
        totalDistance: 0,
        avgEnthusiasm: 0,
        enthusiasmSum: 0
      }
    }

    acc[type].count += 1
    acc[type].totalDuration += movement.durationMinutes || 0
    acc[type].totalDistance += movement.distanceMeters || 0
    acc[type].enthusiasmSum += movement.enthusiasm || 5
    acc[type].avgEnthusiasm = acc[type].enthusiasmSum / acc[type].count

    return acc
  }, {})

  // Convert to chart data with colors
  const chartData = Object.values(movementTypes).map((type: any, index: number) => {
    const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']
    return {
      name: type.name.charAt(0).toUpperCase() + type.name.slice(1),
      value: type.count,
      duration: Math.round(type.totalDuration),
      distance: parseFloat(type.totalDistance.toFixed(2)),
      enthusiasm: Math.round(type.avgEnthusiasm * 10), // Scale to 100 for radial bar
      fill: colors[index % colors.length]
    }
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-blue-600">Count: {data.value} sessions</p>
          <p className="text-green-600">Total Duration: {data.duration} min</p>
          <p className="text-purple-600">Total Distance: {data.distance} mi</p>
          <p className="text-orange-600">Avg Enthusiasm: {(data.enthusiasm / 10).toFixed(1)}/10</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Recent Movements</h3>
            <p className="text-sm text-gray-500">Activity breakdown</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">{totalDurationToday}min</div>
          <div className="text-sm text-gray-500">Today</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="80%"
          data={chartData}
          startAngle={90}
          endAngle={450}
        >
          <PolarAngleAxis type="number" domain={[0, Math.max(...chartData.map((d) => d.value))]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={4} fill="url(#gradient)" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconSize={12}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MiniMovementsGraph
