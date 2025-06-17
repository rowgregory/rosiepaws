import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface MiniWaterChartProps {
  waterData: any[]
}

const MiniWaterChart: React.FC<MiniWaterChartProps> = ({ waterData = [] }) => {
  // Use the waterData prop instead of chartData.waterIntake
  const recentWaterData = waterData.slice(-7)

  if (!recentWaterData.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Water Intake Trend</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                />
              </svg>
            </div>
            <p className="text-sm">No water data</p>
          </div>
        </div>
      </div>
    )
  }

  // Group by date and process both exact and relative measurements
  const dailyData = new Map()

  recentWaterData.forEach((entry: any) => {
    const date = new Date(entry.timeRecorded)
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' })

    if (!dailyData.has(dayKey)) {
      dailyData.set(dayKey, {
        day: dayKey,
        amount: 0,
        relativeCount: 0,
        relativeMore: 0,
        relativeSame: 0,
        relativeLess: 0
      })
    }

    const dayData = dailyData.get(dayKey)

    if (entry.intakeType === 'milliliters' && entry.milliliters) {
      dayData.amount += parseInt(entry.milliliters) || 0
    } else if (entry.intakeType === 'relative' && entry.relativeIntake) {
      dayData.relativeCount++
      if (entry.relativeIntake === 'more') dayData.relativeMore++
      else if (entry.relativeIntake === 'same') dayData.relativeSame++
      else if (entry.relativeIntake === 'less') dayData.relativeLess++
    }
  })

  const processedData = Array.from(dailyData.values())
  const hasExactData = processedData.some((day: any) => day.amount > 0)
  const hasRelativeData = processedData.some((day: any) => day.relativeCount > 0)

  const renderChart = () => {
    if (hasExactData) {
      // Show bar chart for exact measurements
      return (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: any) => [`${value}ml`, 'Water Intake']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[2, 2, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          {hasRelativeData && (
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">
                + {processedData.reduce((sum: number, day: any) => sum + day.relativeCount, 0)} relative measurements
              </span>
            </div>
          )}
        </>
      )
    } else if (hasRelativeData) {
      // Show relative measurements summary as pie chart
      const totalRelative = processedData.reduce(
        (acc: any, day: any) => {
          acc.more += day.relativeMore
          acc.same += day.relativeSame
          acc.less += day.relativeLess
          return acc
        },
        { more: 0, same: 0, less: 0 }
      )

      const relativeData = [
        { type: 'More', count: totalRelative.more, color: '#3b82f6' },
        { type: 'Same', count: totalRelative.same, color: '#10b981' },
        { type: 'Less', count: totalRelative.less, color: '#f59e0b' }
      ].filter((item) => item.count > 0)

      return (
        <>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={relativeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {relativeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} times`, 'Count']}
                  labelFormatter={(label) => `${label} than usual`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-3 mt-2">
            {relativeData.map((item: any) => (
              <div key={item.type} className="flex items-center space-x-1 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span>{item.type}</span>
              </div>
            ))}
          </div>
        </>
      )
    } else {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                />
              </svg>
            </div>
            <p className="text-sm">No water data</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Water Intake Trend</h3>
      {renderChart()}
    </div>
  )
}

export default MiniWaterChart
