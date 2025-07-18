import React, { FC, useMemo } from 'react'
import { XAxis, YAxis, ResponsiveContainer, Tooltip, ScatterChart, CartesianGrid, Scatter } from 'recharts'
import { MapPin, Smile, Activity, Award, Clock, AlertCircle, Footprints } from 'lucide-react'
import { calculatePace, getDistanceMiles, getDurationMinutes, getMoodEmoji } from '@/app/lib/utils'

interface ChartDataPoint {
  id: string
  walk: string
  distance: number
  duration: number
  moodRating: number
  pace: number
  distraction: string
  movement: string
  date: string
  fullDate: string
  notes: string
  fill: string
}

interface IWalkData {
  timeRecorded: string | number | Date
  distance: string
  duration: string
  id: any
  moodRating: any
  distraction: any
  movement: any
  notes: any
  pace: number
}

const LargeWalkGraph: FC<{ walks: any; petWeight: any }> = ({ walks, petWeight }) => {
  const chartData: ChartDataPoint[] = useMemo(() => {
    return walks.map((walk: IWalkData, index: number) => {
      const date = new Date(walk.timeRecorded)
      const distanceMiles = getDistanceMiles(walk.distance)
      const durationMinutes = getDurationMinutes(walk.duration)
      const calculatedPace = calculatePace(walk.distance, walk.duration)

      return {
        id: walk.id,
        walk: `Walk ${index + 1}`,
        distance: distanceMiles,
        duration: durationMinutes,
        moodRating: walk.moodRating || 0,
        pace: calculatedPace,
        distraction: walk.distraction || 'Unknown',
        movement: walk.pace || 'Unknown',
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        fullDate: walk.timeRecorded,
        notes: walk.notes || '',
        // For scatter plot styling
        fill: calculatedPace > 0 ? `hsl(${Math.max(0, 120 - calculatedPace * 8)}, 70%, 50%)` : '#6b7280'
      }
    })
  }, [walks])

  // Custom dot component for scatter plot
  const CustomScatterDot = (props: any) => {
    const { cx, cy, payload } = props
    return (
      <circle
        cx={cx}
        cy={cy}
        r={Math.max(payload.moodRating * 3.5 + 3, 4)} // Size based on mood
        fill={payload.fill}
        stroke="#fff"
        strokeWidth={2}
        fillOpacity={0.8}
      />
    )
  }

  // Calculate comprehensive stats
  const totalWalks = chartData.length
  const totalDistance = chartData.reduce((sum, walk) => sum + getDistanceMiles(walk.distance.toString()), 0)
  const totalDuration = chartData.reduce((sum, walk) => sum + getDurationMinutes(walk.duration.toString()), 0)
  const avgMood = totalWalks
    ? Math.round(chartData.reduce((sum, walk) => sum + (walk.moodRating || 0), 0) / totalWalks)
    : 0
  const avgPace = totalDistance > 0 ? (totalDuration / totalDistance).toFixed(1) : '0'
  const longestWalk = totalWalks
    ? Math.max(...chartData.map((w) => getDistanceMiles(w.distance.toString()))).toFixed(1)
    : '0'

  const recommendedDaily = parseFloat(petWeight?.toString().replace(/[^0-9.]/g, '') || '20') * 0.1

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-gray-500 to-zinc-500 rounded-lg">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Walk Analytics</h2>
            <p className="text-sm text-gray-500">Comprehensive walk tracking and insights</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-600">{totalDistance}mi</div>
          <div className="text-sm text-gray-500">Latest Day</div>
          <div className="text-xs text-gray-400 mt-1">Target: {recommendedDaily}mi/day</div>
        </div>
      </div>

      {/* Main Scatter Plot */}
      <div className="space-y-4">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
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
                offset: -10,
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
                value: 'Duration (minutes)',
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
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload

                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-800">{data.date}</p>
                      <p className="text-blue-600">{data.distance} miles</p>
                      <p className="text-green-600">{data.duration} minutes</p>
                      <p className="text-purple-600">
                        Mood: {getMoodEmoji(String(data.moodRating))} {data.moodRating}/10
                      </p>
                      <p className="text-orange-600">Pace: {data.pace.toFixed(1)} min/mi</p>
                      <p className="text-gray-600">Distraction: {data.distraction}</p>
                      {data.movement && <p className="text-gray-600">Movement: {data.movement}</p>}
                      {data.notes && <p className="text-gray-500 text-sm mt-1">&quot;{data.notes}&quot;</p>}
                    </div>
                  )
                }
                return null
              }}
            />

            <Scatter name="Walks" data={chartData} shape={<CustomScatterDot />} />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Scatter Plot Legend */}
        {chartData.length > 0 && (
          <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Fast pace</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium pace</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Slow pace</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span>Mood (size)</span>
            </div>
          </div>
        )}
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        {/* Total Walks */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-4 h-4 text-blue-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-blue-600">{totalWalks}</div>
          <div className="text-xs text-gray-600">Total Walks</div>
        </div>

        {/* Total Distance */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <MapPin className="w-4 h-4 text-green-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-green-600">{totalDistance.toFixed(1)} mi</div>
          <div className="text-xs text-gray-600">Total Distance</div>
        </div>

        {/* Average Mood */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Smile className="w-4 h-4 text-yellow-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-yellow-600">
            {getMoodEmoji(String(avgMood))} {avgMood}/4
          </div>
          <div className="text-xs text-gray-600">Avg Mood</div>
        </div>

        {/* Longest Walk */}
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Award className="w-4 h-4 text-purple-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-purple-600">{longestWalk} mi</div>
          <div className="text-xs text-gray-600">Longest Walk</div>
        </div>

        {/* Average Pace */}
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-orange-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-orange-600">{avgPace} min/mi</div>
          <div className="text-xs text-gray-600">Avg Pace</div>
        </div>

        {/* Most Common Distraction */}
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-red-600">
            {(() => {
              const distractionLevels = chartData.map((walk) => walk.distraction || 'Unknown')
              const levelCounts = distractionLevels.reduce(
                (acc, level) => {
                  acc[level] = (acc[level] || 0) + 1
                  return acc
                },
                {} as Record<string, number>
              )

              const mostCommon =
                Object.entries(levelCounts).reduce((a, b) => (levelCounts[a[0]] > levelCounts[b[0]] ? a : b))?.[0] ||
                'Unknown'

              return mostCommon
            })()}
          </div>
          <div className="text-xs text-gray-600">Most Common</div>
        </div>
      </div>
    </div>
  )
}

export default LargeWalkGraph
