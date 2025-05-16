'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { date: 'Jan', volume: 1000 },
  { date: 'Feb', volume: 1800 },
  { date: 'Mar', volume: 2500 },
  { date: 'Apr', volume: 3200 },
  { date: 'May', volume: 4000 },
  { date: 'Jun', volume: 4800 },
  { date: 'Jul', volume: 5600 },
  { date: 'Aug', volume: 6400 },
  { date: 'Sep', volume: 7200 },
  { date: 'Oct', volume: 8000 },
  { date: 'Nov', volume: 9000 },
  { date: 'Dec', volume: 10000 }
]

const GrossVolumeLineChart = () => {
  return (
    <ResponsiveContainer width="100%" height={120} style={{ marginTop: '35px' }}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 8, bottom: 0 }}>
        <XAxis
          dataKey="date"
          axisLine={{ stroke: '#e4e4e4' }}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          interval={0}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
          labelStyle={{ color: '#6b7280' }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Gross Volume']}
        />
        <Line type="monotone" dataKey="volume" stroke="#6b7280" strokeWidth={1} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default GrossVolumeLineChart
