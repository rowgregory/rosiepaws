import React from 'react'
import { XAxis, YAxis, ResponsiveContainer, Tooltip, ScatterChart, CartesianGrid, Scatter } from 'recharts'
import { Stethoscope, Thermometer } from 'lucide-react'
import { NORMAL_RANGES } from '@/app/lib/constants'

const MiniVitalSignsGraph = ({ vitalSigns, pet }: any) => {
  if (vitalSigns?.length === 0 || vitalSigns === null || vitalSigns === undefined) return

  // Sort vital signs chronologically for chart
  const sortedVitalSigns = vitalSigns
    ? [...vitalSigns].sort((a: any, b: any) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
    : []

  // Prepare chart data (last 7 assessments for better visualization)
  const chartData = sortedVitalSigns.slice(-7).map((vs: any, index: number) => {
    return {
      assessmentNumber: index + 1,
      temperature: vs.temperature || 0,
      heartRate: vs.heartRate || 0,
      respiratoryRate: vs.respiratoryRate || 0,
      weight: vs.weight || 0,
      date: new Date(vs.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      fullDate: vs.createdAt,
      notes: vs.notes || '',
      capillaryRefillTime: vs.capillaryRefillTime || '',
      mucousMembranes: vs.mucousMembranes || '',
      hydrationStatus: vs.hydrationStatus || '',
      bloodPressure: vs.bloodPressure || ''
    }
  })

  // Custom dot component for scatter plot
  const CustomScatterDot = (props: any) => {
    const { cx, cy, payload } = props
    const size =
      payload.healthStatus === 'emergency'
        ? 8
        : payload.healthStatus === 'contact_vet'
          ? 7
          : payload.healthStatus === 'monitor'
            ? 6
            : 5

    return (
      <circle cx={cx} cy={cy} r={size} fill={payload.statusColor} stroke="#fff" strokeWidth={2} fillOpacity={0.8} />
    )
  }

  // Get today's assessments
  const getTodaysAssessments = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return vitalSigns.filter((vs: any) => {
      const vsDate = new Date(vs.createdAt)
      vsDate.setHours(0, 0, 0, 0)
      return vsDate.getTime() === today.getTime()
    }).length
  }

  const todaysAssessments = getTodaysAssessments()

  // Get latest temperature for header display
  const latestTemperature = chartData.length > 0 ? chartData[chartData.length - 1].temperature : 0

  // Get normal ranges for reference lines
  const petType = pet?.type?.toUpperCase() || 'DOG'
  const normalRanges = NORMAL_RANGES[petType as keyof typeof NORMAL_RANGES]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-slate-500 to-stone-500 rounded-lg">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Vital Signs</h3>
            <p className="text-sm text-gray-500">Last 7 assessments</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-red-500" />
            <div className="text-2xl font-bold text-gray-600">{latestTemperature}°F</div>
          </div>
          <div className="text-sm text-gray-500">Latest</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="33%" stopColor="#f59e0b" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          {/* Normal range reference lines */}
          {normalRanges && (
            <>
              {/* Temperature normal range indicators */}
              <line
                x1={normalRanges.temperature.min}
                y1="0%"
                x2={normalRanges.temperature.min}
                y2="100%"
                stroke="#10b981"
                strokeDasharray="2,2"
                opacity={0.4}
              />
              <line
                x1={normalRanges.temperature.max}
                y1="0%"
                x2={normalRanges.temperature.max}
                y2="100%"
                stroke="#10b981"
                strokeDasharray="2,2"
                opacity={0.4}
              />
            </>
          )}

          <XAxis
            type="number"
            dataKey="temperature"
            name="Temperature"
            unit="°F"
            domain={
              normalRanges
                ? [normalRanges.temperature.min - 0.5, normalRanges.temperature.max + 0.5]
                : ['dataMin', 'dataMax']
            }
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Temperature (°F)',
              position: 'bottom',
              offset: -5,
              style: { textAnchor: 'middle', fontSize: '12px' }
            }}
          />
          <YAxis
            type="number"
            dataKey="heartRate"
            name="Heart Rate"
            unit="bpm"
            domain={
              normalRanges ? [normalRanges.heartRate.min - 10, normalRanges.heartRate.max + 10] : ['dataMin', 'dataMax']
            }
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Heart Rate (bpm)',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '12px' }
            }}
          />

          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-800">{data.date}</p>
                    <div className="space-y-1 mt-2">
                      <p className="text-red-600">🌡️ {data.temperature}°F</p>
                      <p className="text-pink-600">❤️ {data.heartRate} bpm</p>
                      <p className="text-green-600">🫁 {data.respiratoryRate}/min</p>
                      <p className="text-blue-600">⚖️ {data.weight} lbs</p>
                      {data.bloodPressure && <p className="text-indigo-600">🩺 {data.bloodPressure}</p>}
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2`}
                      style={{ backgroundColor: data.statusColor + '20', color: data.statusColor }}
                    >
                      {data.healthStatus === 'normal'
                        ? '✓ Normal'
                        : data.healthStatus === 'monitor'
                          ? '⚠ Monitor'
                          : data.healthStatus === 'contact_vet'
                            ? '📞 Contact Vet'
                            : data.healthStatus === 'emergency'
                              ? '🚨 Emergency'
                              : 'Unknown'}
                    </div>
                    {data.notes && <p className="text-gray-500 text-sm mt-1">&quot;{data.notes}&quot;</p>}
                  </div>
                )
              }
              return null
            }}
          />

          <Scatter name="Assessments" data={chartData} shape={<CustomScatterDot />} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{chartData.length}</div>
            <div className="text-xs text-gray-500">Recent Records</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{todaysAssessments}</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span>Monitor</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span>Contact Vet</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Emergency</span>
        </div>
      </div>
    </div>
  )
}

export default MiniVitalSignsGraph
