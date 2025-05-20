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
    <ResponsiveContainer height={200} style={{ marginTop: '35px' }}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: -35,
          bottom: 5
        }}
      >
        <XAxis dataKey="date" tickLine={false} tickFormatter={formatDate} tick={{ fontSize: 14 }} interval={0} />
        <YAxis dataKey="score" tickLine={false} tick={{ fontSize: 14 }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
          labelStyle={{ color: '#6b7280', fontSize: '12px' }}
          formatter={(value: number) => [`${value}`, 'Pain Score']}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="score" stroke="#5f67f0" strokeWidth={1} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default GuardianPainScoreGraph
