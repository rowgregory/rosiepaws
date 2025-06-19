import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { AlertTriangle, TrendingUp, Calendar } from 'lucide-react'

interface SeizureData {
  date: string
  time: string
  duration: number
}

interface MiniSeizureChartProps {
  seizures?: SeizureData[]
  className?: string
}

const MiniSeizureChart: React.FC<MiniSeizureChartProps> = ({ seizures = [], className = '' }) => {
  const chartData = useMemo(() => {
    // Get last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    return days.map((day) => {
      const dayString = day.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })

      const daySeizures = seizures.filter((seizure) => {
        return seizure.date === dayString
      })

      const totalDuration = daySeizures.reduce((sum, seizure) => sum + (seizure.duration || 0), 0)
      const avgDuration = daySeizures.length > 0 ? totalDuration / daySeizures.length : 0

      return {
        date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: daySeizures.length,
        duration: Math.round(avgDuration),
        totalDuration: Math.round(totalDuration),
        hasEmergency: daySeizures.some((s) => (s.duration || 0) >= 300 || daySeizures.length > 5)
      }
    })
  }, [seizures])

  const totalSeizures = seizures.length
  const recentSeizures = seizures.filter((s) => {
    const today = new Date()
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const seizureDate = new Date(s.date)
    return seizureDate >= weekAgo && seizureDate <= today
  }).length

  const emergencySeizures = seizures.filter((s) => (s.duration || 0) >= 300).length

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Count: <span className="font-medium">{data.count}</span>
          </p>
          {data.count > 0 && (
            <p className="text-sm text-purple-600">
              Avg Duration: <span className="font-medium">{data.duration}s</span>
            </p>
          )}
          {data.hasEmergency && <p className="text-sm text-red-600 font-medium">⚠️ Emergency</p>}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Seizure Activity</h3>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{recentSeizures}</div>
          <div className="text-sm text-gray-500">This week</div>
        </div>
      </div>

      {/* Chart */}
      {totalSeizures > 0 ? (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mb-6 h-[120px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No seizure data</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{totalSeizures}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{recentSeizures}</div>
          <div className="text-xs text-gray-600">This Week</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{emergencySeizures}</div>
          <div className="text-xs text-gray-600">Emergency</div>
        </div>
      </div>

      {/* Emergency Alert */}
      {emergencySeizures > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {emergencySeizures} emergency seizure{emergencySeizures > 1 ? 's' : ''} recorded
              </p>
              <p className="text-xs text-red-600">5+ minute duration requires immediate vet care</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentSeizures > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{recentSeizures > totalSeizures * 0.5 ? 'Increased' : 'Stable'} activity</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Updated {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniSeizureChart
