import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { AlertTriangle, Zap } from 'lucide-react'

interface GuardianSeizureGraphProps {
  seizureData: any
}

const GuardianSeizureGraph: React.FC<GuardianSeizureGraphProps> = ({ seizureData = [] }) => {
  // Process data for chart
  const chartData = useMemo(() => {
    if (!seizureData.length) return []

    return seizureData
      .map((seizure: any) => ({
        date: seizure.date,
        duration: seizure.duration,
        time: seizure.time
      }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [seizureData])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const latestDuration = seizureData?.slice(-1)[0]?.duration || 0
  const averageDuration =
    seizureData.length > 0
      ? (seizureData.reduce((sum: any, seizure: any) => sum + seizure.duration, 0) / seizureData.length).toFixed(1)
      : '0'
  const emergencySeizures = seizureData.filter((s: any) => s.duration >= 300).length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Seizure Duration Tracking</h3>
            <p className="text-sm text-gray-600">Monitor seizure patterns and duration over time</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-600">{latestDuration}s</div>
          <div className="text-sm text-gray-500">Latest Duration</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="seizureLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
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
            dataKey="duration"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 300]}
            label={{ value: 'Duration (seconds)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value} seconds`, 'Duration']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" opacity={0.6} />
          <Line
            type="monotone"
            dataKey="duration"
            stroke="url(#seizureLineGradient)"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#ef4444', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{latestDuration}s</div>
          <div className="text-xs text-gray-600">Latest</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{averageDuration}s</div>
          <div className="text-xs text-gray-600">Average</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-600">{seizureData.length}</div>
          <div className="text-xs text-gray-600">Total Seizures</div>
        </div>
      </div>

      {/* Emergency Alert */}
      {emergencySeizures > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 text-sm mb-1">Emergency Seizures Detected</h4>
              <p className="text-sm text-red-700">
                {emergencySeizures} seizure{emergencySeizures > 1 ? 's' : ''} lasted 5+ minutes. Consult your
                veterinarian immediately for seizures of this duration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuardianSeizureGraph
