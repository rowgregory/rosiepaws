import React, { FC } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Droplets } from 'lucide-react'

const MiniWaterGraph: FC<{ waters: any }> = ({ waters }) => {
  if (waters?.length === 0 || waters === null || waters === undefined) return

  // Group by date and process exact measurements
  const dailyData = new Map()

  waters.forEach((entry: any) => {
    const date = new Date(entry.timeRecorded)
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' })

    if (!dailyData.has(dayKey)) {
      dailyData.set(dayKey, {
        day: dayKey,
        amount: 0,
        entries: 0
      })
    }

    const dayData = dailyData.get(dayKey)
    dayData.amount += parseInt(entry.milliliters) || 0
    dayData.entries += 1
  })

  const processedData = Array.from(dailyData.values())
  const hasExactData = processedData.some((day: any) => day.amount > 0)

  // Calculate stats
  const totalIntake = processedData.reduce((sum, day) => sum + day.amount, 0)
  const averageDaily = Math.round(totalIntake / Math.max(processedData.length, 1))
  const highestDay = processedData.reduce((max, day) => (day.amount > max.amount ? day : max), { amount: 0, day: '' })
  const totalEntries = waters.length
  const averagePerEntry = Math.round(totalIntake / Math.max(totalEntries, 1))

  // Get mood data
  const averageMood =
    waters.reduce((sum: number, entry: any) => sum + (entry.moodRating || 0), 0) / Math.max(waters.length, 1)
  const moodTrend =
    averageMood >= 4 ? 'Great' : averageMood >= 3 ? 'Good' : averageMood >= 2 ? 'Fair' : 'Needs Attention'
  // Calculate today's total
  const today = new Date()

  const todayTotal = waters
    .filter((entry: any) => {
      const entryDate = new Date(entry.timeRecorded)
      return entryDate.toDateString() === today.toDateString()
    })
    .reduce((sum: number, entry: any) => sum + (parseInt(entry.milliliters) || 0), 0)

  const renderChart = () => {
    if (hasExactData) {
      // Show bar chart for exact measurements
      return (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [`${value}ml`, 'Water Intake']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="amount" fill="#0ea5e9" radius={[2, 2, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )
    }
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
            <h3 className="font-semibold text-gray-900">Water Intake Trend</h3>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{todayTotal}ml</div>
          <div className="text-sm text-gray-500">{hasExactData ? 'Today' : 'Entries'}</div>
        </div>
      </div>

      {renderChart()}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Intake */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{totalIntake.toLocaleString()}ml</div>
            <div className="text-xs text-blue-600 font-medium">Total Intake</div>
            <div className="text-xs text-gray-500 mt-1">{totalEntries} entries</div>
          </div>

          {/* Daily Average */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{averageDaily.toLocaleString()}ml</div>
            <div className="text-xs text-green-600 font-medium">Daily Average</div>
            <div className="text-xs text-gray-500 mt-1">per day</div>
          </div>

          {/* Highest Day */}
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{highestDay.amount.toLocaleString()}ml</div>
            <div className="text-xs text-purple-600 font-medium">Best Day</div>
            <div className="text-xs text-gray-500 mt-1">{highestDay.day || 'N/A'}</div>
          </div>

          {/* Mood Trend */}
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-700">{averageMood.toFixed(1)}/5</div>
            <div className="text-xs text-yellow-600 font-medium">Avg Mood</div>
            <div className="text-xs text-gray-500 mt-1">{moodTrend}</div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Avg per entry: {averagePerEntry}ml</span>
          </div>
          {processedData.length > 1 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>
                Consistency: {processedData.filter((day) => day.amount > 0).length}/{processedData.length} days
              </span>
            </div>
          )}
          {totalIntake > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>
                {totalIntake >= 2000
                  ? 'Excellent hydration!'
                  : totalIntake >= 1500
                    ? 'Good hydration'
                    : 'Consider increasing intake'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MiniWaterGraph
