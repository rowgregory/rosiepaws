import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Droplets, TrendingUp, Calendar, Smile, Target, Award } from 'lucide-react'

interface LargeWaterGraphProps {
  waterData: any
  petWeight?: any
}

const LargeWaterGraph: React.FC<LargeWaterGraphProps> = ({ waterData = [], petWeight = 20 }) => {
  // Process data for chart and calculate stats in one go
  const { chartData, stats } = useMemo(() => {
    if (!waterData.length)
      return {
        chartData: [],
        stats: {
          recommendedDaily: 0,
          latestAmount: 0,
          averageAmount: 0,
          totalEntries: 0,
          averageMood: 0,
          bestDay: 0,
          consistencyDays: 0,
          weeklyTotal: 0,
          targetAchieved: 0,
          entriesWithNotes: 0
        }
      }

    // Filter entries with valid dates
    const validEntries = waterData.filter((entry: any) => {
      const date = new Date(entry.timeRecorded)
      return !isNaN(date.getTime())
    })

    if (!validEntries.length)
      return {
        chartData: [],
        stats: {
          recommendedDaily: 0,
          latestAmount: 0,
          averageAmount: 0,
          totalEntries: 0,
          averageMood: 0,
          bestDay: 0,
          consistencyDays: 0,
          weeklyTotal: 0,
          targetAchieved: 0,
          entriesWithNotes: 0
        }
      }

    // Group by date
    const dailyData = new Map()

    validEntries.forEach((entry: any) => {
      const date = new Date(entry.timeRecorded)
      const dateKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })

      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          date: dateKey,
          exactAmount: 0,
          exactCount: 0,
          totalEntries: 0,
          moodSum: 0,
          moodCount: 0
        })
      }

      const dayData = dailyData.get(dateKey)
      dayData.totalEntries += 1
      dayData.exactAmount += parseInt(entry.milliliters) || 0
      dayData.exactCount += 1
      if (entry.moodRating) {
        dayData.moodSum += entry.moodRating
        dayData.moodCount += 1
      }
    })

    // Convert to array and sort by date
    const processedChartData = Array.from(dailyData.values()).sort(
      (a, b) => new Date(a.date + ', 2025').getTime() - new Date(b.date + ', 2025').getTime()
    )

    // Calculate all stats
    const recommendedDaily = parseFloat(petWeight?.toString().replace(/[^0-9.]/g, '') || '20') * 50
    const latestAmount = processedChartData?.slice(-1)[0]?.exactAmount || 0
    const averageAmount =
      processedChartData.length > 0
        ? Math.round(processedChartData.reduce((sum, day) => sum + day.exactAmount, 0) / processedChartData.length)
        : 0
    const totalEntries = processedChartData.reduce((sum, day) => sum + Number(day.totalEntries), 0)

    // Calculate average mood
    const moodEntries = waterData.filter((entry: any) => entry.moodRating && entry.moodRating > 0)
    const averageMood =
      moodEntries.length > 0
        ? moodEntries.reduce((sum: number, entry: any) => sum + entry.moodRating, 0) / moodEntries.length
        : 0

    // Find best day
    const bestDay = processedChartData.length > 0 ? Math.max(...processedChartData.map((day) => day.exactAmount)) : 0

    // Calculate consistency (days with intake)
    const consistencyDays = processedChartData.filter((day) => day.exactAmount > 0).length

    // Calculate weekly total (last 7 days)
    const last7Days = processedChartData.slice(-7)
    const weeklyTotal = last7Days.reduce((sum, day) => sum + day.exactAmount, 0)

    // Calculate target achievement days
    const targetAchieved = processedChartData.filter((day) => day.exactAmount >= recommendedDaily).length
    // Count entries with notes
    const entriesWithNotes = waterData.filter((entry: any) => entry.notes && entry.notes.trim()).length

    return {
      chartData: processedChartData,
      stats: {
        recommendedDaily,
        latestAmount,
        averageAmount,
        totalEntries,
        averageMood,
        bestDay,
        consistencyDays,
        weeklyTotal,
        targetAchieved,
        entriesWithNotes
      }
    }
  }, [waterData, petWeight])

  // Custom tooltip for daily chart
  const DailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = data.exactAmount > 0 ? Math.round((data.exactAmount / stats.recommendedDaily) * 100) : 0
      const avgMood = data.moodCount > 0 ? (data.moodSum / data.moodCount).toFixed(1) : 'N/A'

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {data.exactAmount > 0 && (
            <>
              <p className="text-blue-600">
                <span className="font-medium">{data.exactAmount}ml</span>
                <span className="text-gray-500"> ({percentage}% of target)</span>
              </p>
              <p className="text-green-600 text-sm">
                {data.exactCount} measurement{data.exactCount > 1 ? 's' : ''}
              </p>
              <p className="text-purple-600 text-sm">Avg Mood: {avgMood}/4</p>
            </>
          )}
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
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Water Intake Tracking</h3>
            <p className="text-sm text-gray-600">Monitor daily hydration levels</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{stats.latestAmount}ml</div>
          <div className="text-sm text-gray-500">Latest Day</div>
          <div className="text-xs text-gray-400 mt-1">Target: {stats.recommendedDaily}ml/day</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.6} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Amount (mL)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={<DailyTooltip />}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />

          {/* Recommended daily intake line */}
          <ReferenceLine
            y={stats.recommendedDaily}
            stroke="#10b981"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: `Target (${stats.recommendedDaily}ml)`,
              position: 'right',
              fontSize: 12,
              fill: '#10b981'
            }}
          />

          {/* Water intake bars */}
          <Bar dataKey="exactAmount" fill="url(#waterGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        {/* Latest Day */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Droplets className="w-4 h-4 text-blue-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-blue-600">{stats.latestAmount}ml</div>
          <div className="text-xs text-gray-600">Latest Day</div>
        </div>

        {/* Daily Average */}
        <div className="text-center p-3 bg-cyan-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-cyan-600">{stats.averageAmount}ml</div>
          <div className="text-xs text-gray-600">Daily Average</div>
        </div>

        {/* Total Entries */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-gray-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-gray-600">{stats.totalEntries}</div>
          <div className="text-xs text-gray-600">Total Entries</div>
        </div>

        {/* Average Mood */}
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Smile className="w-4 h-4 text-purple-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-purple-600">{stats.averageMood}/4</div>
          <div className="text-xs text-gray-600">Avg Mood</div>
        </div>

        {/* Best Day */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Award className="w-4 h-4 text-yellow-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-yellow-600">{stats.bestDay}ml</div>
          <div className="text-xs text-gray-600">Best Day</div>
        </div>

        {/* Consistency */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-green-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-green-600">{stats.consistencyDays}</div>
          <div className="text-xs text-gray-600">Active Days</div>
        </div>

        {/* Weekly Total */}
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-indigo-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-indigo-600">{stats.weeklyTotal}ml</div>
          <div className="text-xs text-gray-600">Weekly Total</div>
        </div>

        {/* Target Achievement */}
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-emerald-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-emerald-600">{stats.targetAchieved}</div>
          <div className="text-xs text-gray-600">Goals Met</div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-medium text-blue-900">Hydration Rate</div>
            <div className="text-blue-700">
              {stats.averageAmount > 0 ? Math.round((stats.averageAmount / stats.recommendedDaily) * 100) : 0}% of daily
              target
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-900">Notes Recorded</div>
            <div className="text-purple-700">{stats.entriesWithNotes} entries with notes</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-medium text-green-900">Success Rate</div>
            <div className="text-green-700">
              {chartData.length > 0 ? Math.round((stats.targetAchieved / chartData.length) * 100) : 0}% days on target
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeWaterGraph
