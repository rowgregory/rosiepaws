'use client'

import React, { FC } from 'react'
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid } from 'recharts'
import { Activity } from 'lucide-react'

const GuardianPainScoreGraph: FC<{ chartData: any }> = ({ chartData }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    // Options for formatting month and day
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const latestScore = chartData?.slice(-1)[0]?.score || '--'
  const averageScore =
    chartData?.length > 0
      ? (chartData.reduce((sum: number, item: any) => sum + item.score, 0) / chartData.length).toFixed(1)
      : '--'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pain Score Tracking</h3>
            <p className="text-sm text-gray-600">Monitor your pet&apos;s pain levels over time</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">{latestScore}</div>
          <div className="text-sm text-gray-500">Latest Score</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="painLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="50%" stopColor="#f04843" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            dataKey="score"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 4]}
            label={{ value: 'Pain Level', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value}/4`, 'Pain Score']}
          />
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" opacity={0.6} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#painLineGradient)"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#f59e0b', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{latestScore}</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{averageScore}</div>
          <div className="text-xs text-gray-600">Average</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-600">{chartData?.length || 0}</div>
          <div className="text-xs text-gray-600">Recordings</div>
        </div>
      </div>
    </div>
  )
}

export default GuardianPainScoreGraph
