import { Heart } from 'lucide-react'
import { FC } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const MiniBloodSugarGraph: FC<{ bloodSugars: any }> = ({ bloodSugars }) => {
  if (bloodSugars?.length === 0 || bloodSugars === null || bloodSugars === undefined) return
  const reversedBloodSugars = bloodSugars ? [...bloodSugars].reverse() : []

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Recent Blood Sugar</h3>
            <p className="text-sm text-gray-500">Last 7 readings</p>
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:text-right">
          <div className="text-2xl font-bold text-pink-600">{bloodSugars?.[0]?.value || '--'}</div>
          <div className="text-sm text-gray-500">Latest (mg/dL)</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={reversedBloodSugars}>
          <defs>
            <linearGradient id="bloodSugarGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <Line
            dataKey="value"
            stroke="url(#bloodSugarGradient)"
            strokeWidth={3}
            dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
          />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
            formatter={(value) => [`${value} mg/dL`, 'Blood Sugar']}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MiniBloodSugarGraph
