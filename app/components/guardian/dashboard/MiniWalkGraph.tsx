import React from 'react'
import { XAxis, YAxis, ResponsiveContainer, Tooltip, ScatterChart, CartesianGrid, Scatter } from 'recharts'
import { Footprints } from 'lucide-react'
import { getDistanceMiles, getDurationMinutes, getTodaysTotalDistance } from '@/app/lib/utils'

const MiniWalkGraph = ({ walks }: any) => {
  if (walks?.length === 0 || walks === null || walks === undefined) return

  // Sort walks chronologically for chart
  const sortedWalks =
    walks?.sort((a: any, b: any) => {
      return new Date(a.timeRecorded).getTime() - new Date(b.timeRecorded).getTime()
    }) || []

  // Prepare chart data (last 10 walks for better scatter visualization)
  const chartData = sortedWalks.slice(-7).map((walk: any, index: number) => {
    const distanceMiles = getDistanceMiles(walk.distance)
    const durationMinutes = getDurationMinutes(walk.duration)
    const mood = walk.moodRating || 4

    // Calculate pace (minutes per mile) for color coding
    const pace = distanceMiles > 0 ? durationMinutes / distanceMiles : 0

    return {
      walkNumber: index + 1,
      distance: distanceMiles,
      duration: durationMinutes,
      moodRating: mood,
      pace: pace,
      date: new Date(walk.timeRecorded).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      fullDate: walk.timeRecorded,
      // Size based on mood (larger = better mood)
      size: Math.max(mood * 15, 60), // Minimum size 60, max ~150
      // Color intensity based on pace
      fill: '#5c6b7f'
    }
  })

  // Custom dot component for scatter plot
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    return (
      <circle
        cx={cx}
        cy={cy}
        r={payload.moodRating * 2 + 4} // Size based on mood
        fill={payload.fill}
        stroke="#fff"
        strokeWidth={2}
        fillOpacity={0.8}
      />
    )
  }

  const totalDistanceToday = getTodaysTotalDistance(walks)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-gray-500 to-zinc-500 rounded-lg">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Recent Walks</h3>
            <p className="text-sm text-gray-500">Last 7 walks</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-600">{totalDistanceToday}mi</div>
          <div className="text-sm text-gray-500">Today</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="scatterGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            type="number"
            dataKey="distance"
            name="Distance"
            unit="mi"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Distance (miles)',
              position: 'bottom',
              offset: -5,
              style: { textAnchor: 'middle', fontSize: '12px' }
            }}
          />
          <YAxis
            type="number"
            dataKey="duration"
            name="Duration"
            unit="min"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Duration (min)',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '12px' }
            }}
          />

          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any, name: string) => {
              if (name === 'Distance') return [`${value} mi`, 'Distance']
              if (name === 'Duration') return [`${value} min`, 'Duration']
              return [value, name]
            }}
            labelFormatter={() => ''}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-800">{data.date}</p>
                    <p className="text-blue-600">{data.distance} miles</p>
                    <p className="text-green-600">{data.duration} minutes</p>
                    <p className="text-purple-600">Mood: {data.moodRating}/10</p>
                    {data.pace > 0 && <p className="text-orange-600">Pace: {data.pace.toFixed(1)} min/mi</p>}
                  </div>
                )
              }
              return null
            }}
          />

          <Scatter name="Walks" data={chartData} shape={<CustomDot />} />

          {/* Trend line would go here if needed */}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MiniWalkGraph
