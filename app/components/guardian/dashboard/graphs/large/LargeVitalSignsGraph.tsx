import React, { FC, useMemo } from 'react'
import { XAxis, YAxis, ResponsiveContainer, Tooltip, ScatterChart, CartesianGrid, Scatter } from 'recharts'
import { Thermometer, Heart, Activity, TrendingUp, AlertTriangle, CheckCircle, Stethoscope } from 'lucide-react'
import { NORMAL_RANGES } from '@/app/lib/constants'
import { getCapillaryRefillTimeLabel, getHydrationStatusLabel, getMucousMembraneLabel } from '@/app/lib/utils'

interface ChartDataPoint {
  id: string
  assessment: string
  temperature: number
  heartRate: number
  respiratoryRate: number
  weight: number
  date: string
  fullDate: string
  notes: string
  healthStatus: string
  statusColor: string
  capillaryRefillTime: string
  mucousMembranes: string
  hydrationStatus: string
  bloodPressure: string
}

interface IVitalSignsData {
  createdAt: string | number | Date
  temperature?: number
  heartRate?: number
  respiratoryRate?: number
  weight?: number
  id: any
  notes?: string
  pet?: any
  capillaryRefillTime?: string
  mucousMembranes?: string
  hydrationStatus?: string
  bloodPressure?: string
}

const LargeVitalSignsGraph: FC<{ vitalSigns: any; pet: any }> = ({ vitalSigns, pet }) => {
  const chartData: ChartDataPoint[] = useMemo(() => {
    return vitalSigns.map((vs: IVitalSignsData, index: number) => {
      const date = new Date(vs.createdAt)

      const getHealthStatus = () => {
        // Example logic - adjust these thresholds based on your requirements
        const temp = vs.temperature || 0
        const heartRate = vs.heartRate || 0
        const respiratoryRate = vs.respiratoryRate || 0

        // Emergency conditions (adjust thresholds as needed)
        if (
          temp > 103 ||
          temp < 95 ||
          heartRate > 160 ||
          heartRate < 40 ||
          respiratoryRate > 40 ||
          respiratoryRate < 8
        ) {
          return 'emergency'
        }
        // Contact vet conditions
        else if (
          temp > 102 ||
          temp < 97 ||
          heartRate > 140 ||
          heartRate < 60 ||
          respiratoryRate > 30 ||
          respiratoryRate < 10
        ) {
          return 'contact_vet'
        }
        // Monitor conditions
        else if (
          temp > 101.5 ||
          temp < 99 ||
          heartRate > 120 ||
          heartRate < 80 ||
          respiratoryRate > 25 ||
          respiratoryRate < 15
        ) {
          return 'monitor'
        }
        // Normal
        else {
          return 'normal'
        }
      }

      // Function to get color based on health status
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'emergency':
            return '#ef4444' // Red
          case 'contact_vet':
            return '#f97316' // Orange
          case 'monitor':
            return '#eab308' // Yellow
          case 'normal':
          default:
            return '#22c55e' // Green
        }
      }

      const healthStatus = getHealthStatus()
      const statusColor = getStatusColor(healthStatus)

      return {
        id: vs.id,
        assessment: `Assessment ${index + 1}`,
        temperature: vs.temperature || 0,
        heartRate: vs.heartRate || 0,
        respiratoryRate: vs.respiratoryRate || 0,
        weight: vs.weight || 0,
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        fullDate: vs.createdAt,
        notes: vs.notes || '',
        capillaryRefillTime: vs.capillaryRefillTime || '',
        mucousMembranes: vs.mucousMembranes || '',
        hydrationStatus: vs.hydrationStatus || '',
        bloodPressure: vs.bloodPressure || '',
        healthStatus,
        statusColor
      }
    })
  }, [vitalSigns])

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

  // Calculate comprehensive stats
  const totalAssessments = chartData.length
  const avgTemperature = totalAssessments
    ? (chartData.reduce((sum, vs) => sum + vs.temperature, 0) / totalAssessments).toFixed(1)
    : '0'
  const avgHeartRate = totalAssessments
    ? Math.round(chartData.reduce((sum, vs) => sum + vs.heartRate, 0) / totalAssessments)
    : 0
  const avgRespiratoryRate = totalAssessments
    ? Math.round(chartData.reduce((sum, vs) => sum + vs.respiratoryRate, 0) / totalAssessments)
    : 0

  const latestWeight = totalAssessments ? chartData[0].weight : 0
  const weightTrend =
    totalAssessments > 1 ? (chartData[0].weight - chartData[chartData.length - 1].weight > 0 ? 'up' : 'down') : 'stable'

  // Health status distribution
  const statusCounts = chartData.reduce(
    (acc, vs) => {
      acc[vs.healthStatus] = (acc[vs.healthStatus] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const normalCount = statusCounts.normal || 0
  const concernCount = (statusCounts.monitor || 0) + (statusCounts.contact_vet || 0) + (statusCounts.emergency || 0)

  // Get normal ranges for pet
  const petType = pet?.type?.toUpperCase() || 'DOG'
  const normalRanges = NORMAL_RANGES[petType as keyof typeof NORMAL_RANGES]

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Health Analytics</h2>
            <p className="text-sm text-gray-500">Comprehensive vital signs tracking and trends</p>
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:text-right">
          <div className="text-2xl font-bold text-gray-600">{totalAssessments}</div>
          <div className="text-sm text-gray-500">Total Records</div>
          <div className="text-xs text-gray-400 mt-1">
            {pet?.name || 'Pet'} • {pet?.type || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Main Scatter Plot - Temperature vs Heart Rate */}
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Temperature vs Heart Rate Correlation</h3>
          <p className="text-sm text-gray-500">Each point represents one health assessment</p>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="temperature"
              name="Temperature"
              unit="°F"
              domain={
                normalRanges
                  ? [normalRanges.temperature.min - 1, normalRanges.temperature.max + 1]
                  : ['dataMin', 'dataMax']
              }
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Temperature (°F)',
                position: 'bottom',
                offset: -10,
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
            />
            <YAxis
              type="number"
              dataKey="heartRate"
              name="Heart Rate"
              unit="bpm"
              domain={
                normalRanges
                  ? [normalRanges.heartRate.min - 10, normalRanges.heartRate.max + 10]
                  : ['dataMin', 'dataMax']
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

            {/* Normal range indicators */}
            {normalRanges && (
              <>
                {/* Temperature normal range */}
                <line
                  x1={normalRanges.temperature.min}
                  y1="0%"
                  x2={normalRanges.temperature.min}
                  y2="100%"
                  stroke="#10b981"
                  strokeDasharray="5,5"
                  opacity={0.3}
                />
                <line
                  x1={normalRanges.temperature.max}
                  y1="0%"
                  x2={normalRanges.temperature.max}
                  y2="100%"
                  stroke="#10b981"
                  strokeDasharray="5,5"
                  opacity={0.3}
                />
              </>
            )}

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
                      <p className="text-red-600">🌡️ {data.temperature}°F</p>
                      <p className="text-pink-600">❤️ {data.heartRate} bpm</p>
                      <p className="text-green-600">🫁 {data.respiratoryRate}/min</p>
                      <p className="text-blue-600">⚖️ {data.weight} lbs</p>
                      {data.capillaryRefillTime && (
                        <p className="text-orange-600">⏱️ {getCapillaryRefillTimeLabel(data.capillaryRefillTime)}</p>
                      )}
                      {data.mucousMembranes && (
                        <p className="text-purple-600">👄 {getMucousMembraneLabel(data.mucousMembranes)}</p>
                      )}
                      {data.hydrationStatus && (
                        <p className="text-cyan-600">💧 {getHydrationStatusLabel(data.hydrationStatus)}</p>
                      )}
                      {data.bloodPressure && <p className="text-indigo-600">🩺 BP: {data.bloodPressure}</p>}
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2`}
                        style={{ backgroundColor: data.statusColor + '20', color: data.statusColor }}
                      >
                        Status: {data?.healthStatus?.replace('_', ' ')}
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

        {/* Scatter Plot Legend */}
        {chartData.length > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center space-y-3 lg:space-x-6 mt-4 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Monitor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Contact Vet</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Emergency</span>
            </div>
          </div>
        )}
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-100">
        {/* Average Temperature */}
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Thermometer className="w-4 h-4 text-red-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-red-600">{avgTemperature}°F</div>
          <div className="text-xs text-gray-600">Avg Temp</div>
          {normalRanges && (
            <div className="text-xs text-gray-400">
              Normal: {normalRanges.temperature.min}-{normalRanges.temperature.max}°F
            </div>
          )}
        </div>

        {/* Average Heart Rate */}
        <div className="text-center p-3 bg-pink-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Heart className="w-4 h-4 text-pink-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-pink-600">{avgHeartRate}</div>
          <div className="text-xs text-gray-600">Avg HR</div>
          {normalRanges && (
            <div className="text-xs text-gray-400">
              Normal: {normalRanges.heartRate.min}-{normalRanges.heartRate.max}
            </div>
          )}
        </div>

        {/* Average Respiratory Rate */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-4 h-4 text-green-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-green-600">{avgRespiratoryRate}</div>
          <div className="text-xs text-gray-600">Avg RR</div>
          {normalRanges && (
            <div className="text-xs text-gray-400">
              Normal: {normalRanges.respiratoryRate.min}-{normalRanges.respiratoryRate.max}
            </div>
          )}
        </div>

        {/* Current Weight */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp
              className={`w-4 h-4 mr-1 ${
                weightTrend === 'up' ? 'text-green-600' : weightTrend === 'down' ? 'text-red-600' : 'text-blue-600'
              }`}
            />
          </div>
          <div className="text-lg font-bold text-blue-600">{latestWeight} lbs</div>
          <div className="text-xs text-gray-600">Current Weight</div>
          <div
            className={`text-xs ${
              weightTrend === 'up' ? 'text-green-600' : weightTrend === 'down' ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            {weightTrend === 'up' ? '↗ Gaining' : weightTrend === 'down' ? '↘ Losing' : '→ Stable'}
          </div>
        </div>

        {/* Normal Assessments */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-green-600">{normalCount}</div>
          <div className="text-xs text-gray-600">Normal</div>
          <div className="text-xs text-gray-400">
            {totalAssessments > 0 ? Math.round((normalCount / totalAssessments) * 100) : 0}%
          </div>
        </div>

        {/* Concerning Assessments */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-yellow-600">{concernCount}</div>
          <div className="text-xs text-gray-600">Need Review</div>
          <div className="text-xs text-gray-400">
            {totalAssessments > 0 ? Math.round((concernCount / totalAssessments) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Recent Trends */}
      {chartData.length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Temperature Trend</span>
                <Thermometer className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {chartData[0].temperature > chartData[1].temperature
                  ? '↗'
                  : chartData[0].temperature < chartData[1].temperature
                    ? '↘'
                    : '→'}
              </div>
              <div className="text-xs text-gray-500">
                {Math.abs(chartData[0].temperature - chartData[1].temperature).toFixed(1)}°F change
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Heart Rate Trend</span>
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {chartData[0].heartRate > chartData[1].heartRate
                  ? '↗'
                  : chartData[0].heartRate < chartData[1].heartRate
                    ? '↘'
                    : '→'}
              </div>
              <div className="text-xs text-gray-500">
                {Math.abs(chartData[0].heartRate - chartData[1].heartRate)} bpm change
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Respiratory Trend</span>
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {chartData[0].respiratoryRate > chartData[1].respiratoryRate
                  ? '↗'
                  : chartData[0].respiratoryRate < chartData[1].respiratoryRate
                    ? '↘'
                    : '→'}
              </div>
              <div className="text-xs text-gray-500">
                {Math.abs(chartData[0].respiratoryRate - chartData[1].respiratoryRate)}/min change
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LargeVitalSignsGraph
