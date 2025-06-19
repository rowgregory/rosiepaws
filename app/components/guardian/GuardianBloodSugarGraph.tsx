import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { Heart } from 'lucide-react'

interface GuardianBloodSugarGraphProps {
  bloodSugarData: any
}

const GuardianBloodSugarGraph: React.FC<GuardianBloodSugarGraphProps> = ({ bloodSugarData = [] }) => {
  // Process data for chart
  const chartData = useMemo(() => {
    if (!bloodSugarData.length) return []

    return bloodSugarData
      .map((reading: any) => ({
        time: reading.time,
        value: reading.value,
        date: reading.date
      }))
      .sort((a: any, b: any) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
  }, [bloodSugarData])

  const getBloodSugarStatus = (value: number) => {
    if (value < 80) return { status: 'Low', color: 'text-red-600' }
    if (value <= 120) return { status: 'Normal', color: 'text-green-600' }
    if (value <= 180) return { status: 'Elevated', color: 'text-yellow-600' }
    return { status: 'High', color: 'text-red-600' }
  }

  const latestReading = bloodSugarData?.slice(-1)[0]
  const latestValue = latestReading?.value || 0
  const latestStatus = getBloodSugarStatus(latestValue)

  const averageValue =
    bloodSugarData.length > 0
      ? Math.round(bloodSugarData.reduce((sum: any, reading: any) => sum + reading.value, 0) / bloodSugarData.length)
      : 0

  const outOfRangeReadings = bloodSugarData.filter((r: any) => r.value < 80 || r.value > 180).length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Blood Sugar Tracking</h3>
            <p className="text-sm text-gray-600">Monitor glucose levels and trends over time</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${latestStatus.color}`}>{latestValue}</div>
          <div className="text-sm text-gray-500">mg/dL ({latestStatus.status})</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="bloodSugarLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.6} />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[60, 300]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Blood Sugar (mg/dL)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => {
              const status = getBloodSugarStatus(value)
              return [`${value} mg/dL (${status.status})`, 'Blood Sugar']
            }}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Low', position: 'right' }} />
          <ReferenceLine
            y={120}
            stroke="#10b981"
            strokeDasharray="5 5"
            label={{ value: 'Normal', position: 'right' }}
          />
          <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'High', position: 'right' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#bloodSugarLineGradient)"
            strokeWidth={3}
            dot={{ fill: '#ec4899', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#ec4899', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center p-3 bg-pink-50 rounded-lg">
          <div className={`text-lg font-bold ${latestStatus.color}`}>{latestValue}</div>
          <div className="text-xs text-gray-600">Latest (mg/dL)</div>
        </div>
        <div className="text-center p-3 bg-rose-50 rounded-lg">
          <div className="text-lg font-bold text-rose-600">{averageValue}</div>
          <div className="text-xs text-gray-600">Average (mg/dL)</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-600">{bloodSugarData.length}</div>
          <div className="text-xs text-gray-600">Total Readings</div>
        </div>
      </div>

      {/* Out of Range Alert */}
      {outOfRangeReadings > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Heart className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 text-sm mb-1">Readings Outside Normal Range</h4>
              <p className="text-sm text-yellow-700">
                {outOfRangeReadings} reading{outOfRangeReadings > 1 ? 's' : ''} outside the normal range (80-180 mg/dL).
                Consider discussing these results with your veterinarian.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Readings */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-4">Recent Readings</h4>
        <div className="space-y-4">
          {bloodSugarData
            ?.slice(-5)
            .reverse()
            .map((reading: any, index: number) => {
              const status = getBloodSugarStatus(reading.value)
              const isOutOfRange = reading.value < 80 || reading.value > 180

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${isOutOfRange ? 'bg-red-50 border-red-200' : 'bg-pink-50 border-pink-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Blood Sugar Reading</h4>
                      <p className="text-sm text-gray-600">
                        Level: {reading.value} mg/dL • Status: <span className={status.color}>{status.status}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {reading.date} at {reading.time}
                      </p>
                    </div>
                    <Heart className={`w-5 h-5 ${isOutOfRange ? 'text-red-500' : 'text-pink-500'}`} />
                  </div>
                </div>
              )
            }) || <p className="text-gray-500 text-center py-8">No blood sugar readings recorded</p>}
        </div>
      </div>
    </div>
  )
}

export default GuardianBloodSugarGraph
