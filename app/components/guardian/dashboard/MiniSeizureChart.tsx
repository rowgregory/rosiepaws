'use client'

import React, { FC } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import { processedSeizureData } from '@/app/lib/utils'

interface MiniSeizureScatterProps {
  seizures?: any[] | null
  className?: string
}

// Severity color mapping
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'MILD':
      return '#22c55e' // green
    case 'MODERATE':
      return '#f97316' // orange
    case 'SEVERE':
      return '#ef4444' // red
    case 'CRITICAL':
      return '#a855f7' // purple
    default:
      return '#6b7280' // gray
  }
}

// Custom Tooltip
export const CustomSeizureTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const seizure = payload[0].payload
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 space-y-2 text-xs">
        <div>
          <span className="font-semibold">Date:</span> {seizure.date}
        </div>
        <div>
          <span className="font-semibold">Duration:</span> {seizure.originalDuration} seconds
        </div>
        <div>
          <span className="font-semibold">Type:</span> {seizure.seizureType}
        </div>
        <div>
          <span className="font-semibold">Severity:</span>
          <span style={{ color: getSeverityColor(seizure.severity) }}> {seizure.severity}</span>
        </div>
        {seizure.triggerFactor && (
          <div>
            <span className="font-semibold">Trigger:</span> {seizure.triggerFactor}
          </div>
        )}
      </div>
    )
  }
  return null
}

const MiniSeizureScatter: FC<MiniSeizureScatterProps> = ({ seizures = [], className = '' }) => {
  // Process seizure data for scatter plot
  const processedData = processedSeizureData(seizures)

  // Calculate summary statistics
  const totalSeizures = processedData.length
  const averageDuration =
    totalSeizures > 0
      ? (processedData.reduce((sum, seizure) => sum + seizure.originalDuration, 0) / totalSeizures).toFixed(1)
      : '0'
  const emergencySeizures = processedData.filter((s: any) => s.originalDuration >= 300).length

  if (totalSeizures === 0) return

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Seizure Tracking</h3>
            <p className="text-sm text-gray-500">Last 7 Days</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-500">{totalSeizures}</div>
          <div className="text-sm text-gray-500">Total Seizures</div>
        </div>
      </div>

      {/* Scatter Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }}
          >
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
            <XAxis dataKey="x" name="Date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis
              dataKey="y"
              name="Duration"
              label={{ value: 'Duration (sec)', angle: -90, position: 'insideCenter', dx: -25 }}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <ZAxis dataKey="z" range={[3, 10]} />
            <Tooltip content={<CustomSeizureTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              data={processedData}
              fillOpacity={0.7}
              shape={(props: any) => {
                const { cx, cy, payload, z } = props
                const color = getSeverityColor(payload.severity)
                return (
                  <circle cx={cx} cy={cy} r={z} fill={color} fillOpacity={0.7} stroke={color} strokeOpacity={0.5} />
                )
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-sm text-gray-600">Avg Duration</div>
          <div className="text-lg font-bold text-orange-600">{averageDuration}s</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Emergency</div>
          <div className="text-lg font-bold text-red-600">{emergencySeizures}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Severity</div>
          <div
            className="text-lg font-bold"
            style={{
              color: getSeverityColor(processedData[processedData.length - 1]?.severity || 'MILD')
            }}
          >
            {processedData[processedData.length - 1]?.severity || 'N/A'}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>
              {totalSeizures > 3 ? 'High Activity' : totalSeizures > 1 ? 'Moderate Activity' : 'Low Activity'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Updated {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiniSeizureScatter
