'use client'

import React, { FC } from 'react'
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid } from 'recharts'

const GuardianPainScoreGraph: FC<{ chartData: any }> = ({ chartData }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    // Options for formatting month and day
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pain Score</h3>
        <p className="text-sm text-gray-600">Track your pet&apos;s pain levels over time</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" tickLine={false} tickFormatter={formatDate} tick={{ fontSize: 12 }} interval={0} />
          <YAxis
            dataKey="score"
            tickLine={false}
            tick={{ fontSize: 12 }}
            label={{ value: 'Pain Level', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`${value}`, 'Pain Score']}
          />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="score" stroke="#5f67f0" strokeWidth={1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GuardianPainScoreGraph
