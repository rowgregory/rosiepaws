import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Droplets } from 'lucide-react'

interface GuardianWaterGraphProps {
  waterData: any
  petWeight?: any
}

const GuardianWaterGraph: React.FC<GuardianWaterGraphProps> = ({ waterData = [], petWeight = 20 }) => {
  // Process data for chart
  const chartData = useMemo(() => {
    if (!waterData.length) return []

    // Filter entries with valid dates
    const validEntries = waterData.filter((entry: any) => {
      const date = new Date(entry.timeRecorded)
      return !isNaN(date.getTime())
    })

    if (!validEntries.length) return []

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
        } else if (entry.relativeIntake === 'same') {
          dayData.relativeSame += 1
        } else if (entry.relativeIntake === 'less') {
          dayData.relativeLess += 1
        }
      }
    })

    // Convert to array and sort by date
    return Array.from(dailyData.values()).sort(
      (a, b) => new Date(a.date + ', 2025').getTime() - new Date(b.date + ', 2025').getTime()
    )
  }, [waterData])

  const recommendedDaily = parseFloat(petWeight?.toString().replace(/[^0-9.]/g, '') || '20') * 50
  const latestAmount = chartData?.slice(-1)[0]?.exactAmount || 0
  const averageAmount =
    chartData.length > 0 ? Math.round(chartData.reduce((sum, day) => sum + day.exactAmount, 0) / chartData.length) : 0
  const totalEntries = chartData.reduce((sum, day) => sum + day.totalEntries, 0)

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

  if (!chartData.length) {
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
            <div className="text-2xl font-bold text-blue-600">--</div>
            <div className="text-sm text-gray-500">No Data</div>
          </div>
        </div>

        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-blue-500" />
            </div>
            <p className="font-medium">No water intake data available</p>
            <p className="text-sm">Start tracking to see intake charts</p>
          </div>
        </div>
      </div>
    )
  }

  const hasExactMeasurements = chartData.some((day) => day.exactAmount > 0)

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
          <div className="text-2xl font-bold text-blue-600">{latestAmount}ml</div>
          <div className="text-sm text-gray-500">Latest Day</div>
        </div>
      </div>

      {/* Chart */}
      {hasExactMeasurements ? (
        <ResponsiveContainer width="100%" height={300}>
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
              y={recommendedDaily}
              stroke="#10b981"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Target (${recommendedDaily}ml)`,
                position: 'right',
                fontSize: 12,
                fill: '#10b981'
              }}
            />

            {/* Water intake bars */}
            <Bar dataKey="exactAmount" fill="url(#waterGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Droplets className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="font-medium">Only relative measurements available</p>
            <p className="text-sm">Add exact measurements (ml) to see detailed charts</p>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{latestAmount}ml</div>
          <div className="text-xs text-gray-600">Latest Day</div>
        </div>
        <div className="text-center p-3 bg-cyan-50 rounded-lg">
          <div className="text-lg font-bold text-cyan-600">{averageAmount}ml</div>
          <div className="text-xs text-gray-600">Daily Average</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-600">{totalEntries}</div>
          <div className="text-xs text-gray-600">Total Entries</div>
        </div>
      </div>
    </div>
  )
}

export default GuardianWaterGraph
