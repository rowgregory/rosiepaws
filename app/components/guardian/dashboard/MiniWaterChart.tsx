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
        amount: 0
      })
    }

    const dayData = dailyData.get(dayKey)

    dayData.amount += parseInt(entry.milliliters) || 0
  })

  const processedData = Array.from(dailyData.values())
  const hasExactData = processedData.some((day: any) => day.amount > 0)

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
          <div className="text-2xl font-bold text-blue-600">{latestAmount}ml</div>
          <div className="text-sm text-gray-500">{hasExactData ? 'Today' : 'Entries'}</div>
        </div>
      </div>

      {renderChart()}
    </div>
  )
}

export default MiniWaterGraph
