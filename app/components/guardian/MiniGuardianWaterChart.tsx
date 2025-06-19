import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Droplets } from 'lucide-react'

interface MiniWaterChartProps {
  waterData: any[]
}

const MiniWaterChart: React.FC<MiniWaterChartProps> = ({ waterData = [] }) => {
  // Use the waterData prop instead of chartData.waterIntake
  const recentWaterData = waterData.slice(-7)

  if (!recentWaterData.length) {
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
            <div className="text-2xl font-bold text-blue-600">--</div>
            <div className="text-sm text-gray-500">No Data</div>
          </div>
        </div>

        <div className="flex items-center justify-center h-48 text-gray-400">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Droplets className="w-6 h-6 text-blue-500" />
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

  // Calculate latest/total values for header
  const totalRelative = processedData.reduce((sum: number, day: any) => sum + day.relativeCount, 0)
  const latestAmount = processedData.slice(-1)[0]?.amount || 0

  const renderChart = () => {
    if (hasExactData) {
      // Show bar chart for exact measurements
      return (
        <>
          <ResponsiveContainer width="100%" height={200}>
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
      // Show relative measurements summary as pie chart with blue/cyan theme
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
        { type: 'More', count: totalRelative.more, color: '#0ea5e9' }, // sky-500
        { type: 'Same', count: totalRelative.same, color: '#06b6d4' }, // cyan-500
        { type: 'Less', count: totalRelative.less, color: '#0284c7' } // sky-600
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
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
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
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm">No water data</p>
          </div>
        </div>
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
          <div className="text-2xl font-bold text-blue-600">
            {hasExactData ? `${latestAmount}ml` : `${totalRelative}`}
          </div>
          <div className="text-sm text-gray-500">{hasExactData ? 'Latest' : 'Entries'}</div>
        </div>
      </div>

      {renderChart()}
    </div>
  )
}

export default MiniWaterChart
