'use client'

import { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, AlertTriangle } from 'lucide-react'
import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ScatterChart, ZAxis, Scatter } from 'recharts'
import { CustomSeizureTooltip } from '../mini/MiniSeizureGraph'
import { processedSeizureData } from '@/app/lib/utils'

enum SeizureSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
}

// Severity color mapping
const getSeverityColor = (severity: any) => {
  switch (severity) {
    case SeizureSeverity.MILD:
      return 'text-green-600'
    case SeizureSeverity.MODERATE:
      return 'text-orange-600'
    case SeizureSeverity.SEVERE:
      return 'text-red-600'
    case SeizureSeverity.CRITICAL:
      return 'text-purple-600'
    default:
      return 'text-gray-600'
  }
}

const LargeSeizureGraph: FC<{
  seizures: any[]
}> = ({ seizures }) => {
  const processedData = processedSeizureData(seizures)

  const [selectedSeizure, setSelectedSeizure] = useState(null) as any

  // Calculate statistics
  const latestSeizure = seizures[0]
  const latestDuration = latestSeizure?.duration ?? 0
  const averageDuration =
    seizures.length > 0
      ? (seizures.reduce((sum: any, seizure: any) => sum + (seizure.duration ?? 0), 0) / seizures.length).toFixed(1)
      : '0'
  const emergencySeizures = seizures.filter((s: any) => (s.duration ?? 0) >= 300).length

  // Severity distribution
  const severityDistribution = seizures.reduce(
    (acc: any, seizure: any) => {
      acc[seizure.severity] = (acc[seizure.severity] ?? 0) + 1
      return acc
    },
    {} as Record<SeizureSeverity, number>
  )

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Seizure Tracking Dashboard</h3>
            <p className="text-sm text-gray-600">Comprehensive seizure pattern analysis</p>
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:text-right">
          <div className="text-2xl font-bold text-amber-600">{latestDuration}s</div>
          <div className="text-sm text-gray-500">Latest Duration</div>
        </div>
      </div>

      {/* Chart */}
      <motion.div variants={itemVariants}>
        <ResponsiveContainer width="100%" height={400}>
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
                  <circle
                    cx={cx}
                    cy={cy}
                    r={z}
                    fill={color}
                    fillOpacity={0.7}
                    stroke={color}
                    strokeOpacity={0.5}
                    onClick={() => {
                      // Update local state
                      setSelectedSeizure(payload)
                    }}
                    className="cursor-pointer"
                  />
                )
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {selectedSeizure && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-blue-800">Seizure Details</h4>
            <button onClick={() => setSelectedSeizure(null)} className="text-blue-600 hover:text-blue-800">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-600">Date</div>
              <div className="font-semibold">{selectedSeizure.date}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Duration</div>
              <div className="font-semibold">{selectedSeizure.originalDuration} seconds</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Type</div>
              <div className="font-semibold">{selectedSeizure.seizureType}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Severity</div>
              <div className="font-semibold" style={{ color: getSeverityColor(selectedSeizure.severity) }}>
                {selectedSeizure.severity}
              </div>
            </div>
            {selectedSeizure.triggerFactor && (
              <div>
                <div className="text-xs text-gray-600">Trigger Factor</div>
                <div className="font-semibold">{selectedSeizure.triggerFactor}</div>
              </div>
            )}
            {selectedSeizure.notes && (
              <div className="col-span-2">
                <div className="text-xs text-gray-600">Notes</div>
                <div className="font-semibold">{selectedSeizure.notes}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center p-3 bg-red-50 rounded-lg"
        >
          <div className="text-lg font-bold text-red-600">{latestDuration}s</div>
          <div className="text-xs text-gray-600">Latest</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center p-3 bg-orange-50 rounded-lg"
        >
          <div className="text-lg font-bold text-orange-600">{averageDuration}s</div>
          <div className="text-xs text-gray-600">Average</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center p-3 bg-gray-50 rounded-lg"
        >
          <div className="text-lg font-bold text-gray-600">{seizures.length}</div>
          <div className="text-xs text-gray-600">Total Seizures</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center p-3 bg-blue-50 rounded-lg"
        >
          <div className={`text-lg font-bold ${getSeverityColor(latestSeizure?.severity ?? SeizureSeverity.MILD)}`}>
            {latestSeizure?.seizureType}
          </div>
          <div className="text-xs text-gray-600">Latest Type</div>
        </motion.div>
      </motion.div>

      {/* Severity Distribution */}
      <motion.div variants={itemVariants} className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Severity Distribution</h4>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          {Object.entries(severityDistribution).map(([severity, count]: any) => (
            <div key={severity} className="text-center">
              <div className={`text-lg font-bold ${getSeverityColor(severity as SeizureSeverity)}`}>{count}</div>
              <div className="text-xs text-gray-600">{severity}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Alert */}
      {emergencySeizures > 0 && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
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
        </motion.div>
      )}
    </div>
  )
}

export default LargeSeizureGraph
