import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line
} from 'recharts'
import { Droplets } from 'lucide-react'

interface SimpleWaterGraphProps {
  waterData: any[]
  petWeight?: any
}

const SimpleWaterGraph: React.FC<SimpleWaterGraphProps> = ({ waterData = [], petWeight = 20 }) => {
  // Process data for chart
  const chartData = useMemo(() => {
    if (!waterData.length) return { daily: [], relative: [] }

    // Filter entries with valid dates
    const validEntries = waterData.filter((entry) => {
      const date = new Date(entry.timeRecorded)
      return !isNaN(date.getTime())
    })

    if (!validEntries.length) return { daily: [], relative: [] }

    // Group by date
    const dailyData = new Map()
    const relativeData = { more: 0, same: 0, less: 0 }

    validEntries.forEach((entry) => {
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
          relativeMore: 0,
          relativeSame: 0,
          relativeLess: 0,
          totalEntries: 0
        })
      }

      const dayData = dailyData.get(dateKey)
      dayData.totalEntries += 1

      if (entry.intakeType === 'milliliters' && entry.milliliters) {
        dayData.exactAmount += parseInt(entry.milliliters) || 0
        dayData.exactCount += 1
      } else if (entry.intakeType === 'relative' && entry.relativeIntake) {
        // Count relative measurements for the day
        if (entry.relativeIntake === 'more') {
          dayData.relativeMore += 1
          relativeData.more += 1
        } else if (entry.relativeIntake === 'same') {
          dayData.relativeSame += 1
          relativeData.same += 1
        } else if (entry.relativeIntake === 'less') {
          dayData.relativeLess += 1
          relativeData.less += 1
        }
      }
    })

    // Convert to array and sort by date
    const dailyArray = Array.from(dailyData.values()).sort(
      (a, b) => new Date(a.date + ', 2025').getTime() - new Date(b.date + ', 2025').getTime()
    )

    // Convert relative data to array for charts
    const relativeArray = [
      { type: 'More than usual', count: relativeData.more, color: '#3B82F6' },
      { type: 'Same as usual', count: relativeData.same, color: '#10B981' },
      { type: 'Less than usual', count: relativeData.less, color: '#F59E0B' }
    ].filter((item) => item.count > 0)

    return { daily: dailyArray, relative: relativeArray }
  }, [waterData])

  const recommendedDaily = petWeight * 50 // 50ml per kg

  // Custom tooltip for daily chart
  const DailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = data.exactAmount > 0 ? Math.round((data.exactAmount / recommendedDaily) * 100) : 0

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
                {data.exactCount} exact measurement{data.exactCount > 1 ? 's' : ''}
              </p>
            </>
          )}
          {(data.relativeMore > 0 || data.relativeSame > 0 || data.relativeLess > 0) && (
            <div className="text-sm mt-2 border-t pt-2">
              <p className="font-medium text-gray-700">Relative measurements:</p>
              {data.relativeMore > 0 && <p className="text-blue-600">• {data.relativeMore} more than usual</p>}
              {data.relativeSame > 0 && <p className="text-green-600">• {data.relativeSame} same as usual</p>}
              {data.relativeLess > 0 && <p className="text-orange-600">• {data.relativeLess} less than usual</p>}
            </div>
          )}
          <p className="text-purple-600 text-sm mt-1">
            {data.totalEntries} total log{data.totalEntries > 1 ? 's' : ''}
          </p>
        </div>
      )
    }
    return null
  }

  if (!chartData.daily.length && !chartData.relative.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
          <p className="font-medium">No water intake data available</p>
          <p className="text-sm">Start tracking to see intake charts</p>
        </div>
      </div>
    )
  }

  const hasExactMeasurements = chartData.daily.some((day) => day.exactAmount > 0)
  //   const hasRelativeMeasurements = chartData.relative.length > 0

  return (
    <div className="space-y-6">
      {/* Daily Intake Chart - only show if we have exact measurements */}
      {hasExactMeasurements && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Daily Water Intake (mL)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.daily} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'Amount (mL)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<DailyTooltip />} />

              {/* Recommended daily intake line */}
              <ReferenceLine
                y={recommendedDaily}
                stroke="#10B981"
                strokeDasharray="5 5"
                label={{
                  value: `Target (${recommendedDaily}ml)`,
                  position: 'right',
                  fontSize: 12,
                  fill: '#10B981'
                }}
              />

              {/* Water intake bars */}
              <Bar dataKey="exactAmount" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trend Line Chart - only show if we have exact measurements */}
      {hasExactMeasurements && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Water Intake Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData.daily.filter((day) => day.exactAmount > 0)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'Amount (mL)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<DailyTooltip />} />

              {/* Recommended daily intake line */}
              <ReferenceLine y={recommendedDaily} stroke="#10B981" strokeDasharray="5 5" />

              {/* Water intake trend line */}
              <Line
                type="monotone"
                dataKey="exactAmount"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Relative Intake Summary */}
      {/* {hasRelativeMeasurements && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Relative Intake Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chartData.relative.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border"
                style={{ borderLeftColor: item.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{item.type}</span>
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.count}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round((item.count / chartData.relative.reduce((sum, r) => sum + r.count, 0)) * 100)}% of
                  relative logs
                </p>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Daily Breakdown */}
      {/* <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Daily Activity</h3>
        <div className="space-y-2">
          {chartData.daily.slice(-7).map((day, index) => {
            const percentage = day.exactAmount > 0 ? Math.round((day.exactAmount / recommendedDaily) * 100) : 0
            const hasExact = day.exactAmount > 0
            const hasRelative = day.relativeMore + day.relativeSame + day.relativeLess > 0

            return (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800 w-16">{day.date}</span>
                  {hasExact && (
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  )}
                  {!hasExact && hasRelative && (
                    <span className="text-sm text-gray-500 italic">Relative measurements only</span>
                  )}
                </div>
                <div className="text-right">
                  {hasExact && (
                    <>
                      <span className="font-bold text-gray-900">{day.exactAmount}ml</span>
                      <span className={`text-sm ml-2 ${percentage >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
                        ({percentage}%)
                      </span>
                    </>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {day.totalEntries} log{day.totalEntries > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div> */}
    </div>
  )
}

export default SimpleWaterGraph
