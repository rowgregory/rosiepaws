import { Activity } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const MiniGuardianPainChart = ({ chartData }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Pain Trends</h3>
            <p className="text-sm text-gray-500">Last 7 assessments</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">{chartData.painScores?.slice(-1)[0]?.score || '--'}</div>
          <div className="text-sm text-gray-500">Latest Score</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData.painScores?.slice(-7)}>
          <defs>
            <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#f04843" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            dataKey="score"
            stroke="#f59e0b"
            strokeWidth={3}
            fill="url(#painGradient)"
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
          />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 4]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [`${value}/4`, 'Pain Score']}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MiniGuardianPainChart
