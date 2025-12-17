import { FC, useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { Heart, Clock, Calendar, Utensils, Pill, TrendingUp, AlertTriangle, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { itemVariants } from '@/app/lib/constants'
import { getBloodSugarStats, getBloodSugarStatus, getMealIcon } from '@/app/lib/utils'

interface BloodSugarReading {
  id: string
  value: string | number
  notes?: string
  timeRecorded: string
  mealRelation: 'FASTING' | 'BEFORE_MEAL' | 'AFTER_MEAL' | 'BEDTIME' | 'RANDOM'
  measurementUnit: 'MG_DL' | 'MMOL_L'
  targetRange?: string
  symptoms?: string
  medicationGiven: boolean
  date: string
  time: string
}

interface LargeBloodSugarGraphProps {
  bloodSugarData: any
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  if (!payload || cx === undefined || cy === undefined) return null

  const medicationColor = payload.medicationGiven ? '#8b5cf6' : '#ec4899'
  return (
    <circle
      cx={cx}
      cy={cy}
      r={payload.medicationGiven ? 6 : 4}
      fill={medicationColor}
      stroke={medicationColor}
      strokeWidth={2}
    />
  )
}

const LargeBloodSugarGraph: FC<LargeBloodSugarGraphProps> = ({ bloodSugarData }) => {
  const stats = useMemo(() => getBloodSugarStats(bloodSugarData), [bloodSugarData])

  const chartData = useMemo(() => {
    if (!bloodSugarData.length) return []

    return bloodSugarData
      .map((reading: BloodSugarReading) => ({
        time: reading.time,
        value: Number(reading.value),
        date: reading.date,
        mealRelation: reading.mealRelation,
        medicationGiven: reading.medicationGiven,
        symptoms: reading.symptoms
      }))
      .sort((a: any, b: any) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
  }, [bloodSugarData])

  if (!stats) return

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg"
          >
            <Heart className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Blood Sugar Analytics</h3>
            <p className="text-sm text-gray-600">Comprehensive glucose monitoring and insights</p>
          </div>
        </div>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mt-2 lg:mt-0 lg:text-right">
          <div className={`text-2xl font-bold ${stats.latestStatus.color}`}>{stats.latestValue}</div>
          <div className="text-sm text-gray-500">mg/dL ({stats.latestStatus.priority})</div>
          <div className="text-xs text-gray-400 mt-1">Most Recent</div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div variants={itemVariants}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 80, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="bloodSugarLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.6} />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              domain={[40, 320]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Blood Sugar (mg/dL)',
                angle: -90,
                position: 'insideCenter',
                dx: -24,
                dy: 0
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name, props) => {
                const status = getBloodSugarStatus(value)
                const mealIcon = getMealIcon(props.payload.mealRelation)
                const medicationText = props.payload.medicationGiven ? ' (+ Medication)' : ''
                return [`${value} mg/dL (${status.priority})${medicationText} ${mealIcon}`, 'Blood Sugar']
              }}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <ReferenceLine
              y={50}
              stroke="#dc2626"
              strokeDasharray="5 5"
              label={{ value: 'Critical Low', position: 'right', fontSize: 12 }}
            />
            <ReferenceLine
              y={80}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: 'Low', position: 'right', fontSize: 12 }}
            />
            <ReferenceLine
              y={150}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{ value: 'Normal', position: 'right', fontSize: 12 }}
            />
            <ReferenceLine
              y={200}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{ value: 'Elevated', position: 'right', fontSize: 12 }}
            />
            <ReferenceLine
              y={300}
              stroke="#dc2626"
              strokeDasharray="5 5"
              label={{ value: 'Critical High', position: 'right', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#bloodSugarLineGradient)"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="text-center p-3 bg-pink-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Heart className="w-4 h-4 text-pink-600 mr-1" />
          </div>
          <div className={`text-lg font-bold ${stats.latestStatus.color}`}>{stats.latestValue}</div>
          <div className="text-xs text-gray-600">Latest Reading</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="text-center p-3 bg-rose-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-rose-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-rose-600">{stats.average}</div>
          <div className="text-xs text-gray-600">Average</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-purple-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-purple-600">{stats.total}</div>
          <div className="text-xs text-gray-600">Total Readings</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-orange-600">{stats.outOfRange}</div>
          <div className="text-xs text-gray-600">Out of Range</div>
        </motion.div>
      </motion.div>

      {/* Comprehensive Analytics */}
      <motion.div variants={itemVariants} className="mt-6 space-y-6">
        {/* Range Breakdown */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Range Distribution
          </h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <div className="text-center p-2 bg-red-100 rounded">
              <div className="font-bold text-red-800">{stats.rangeBreakdown.criticalLow}</div>
              <div className="text-red-600">Critical Low</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-bold text-red-600">{stats.rangeBreakdown.low}</div>
              <div className="text-red-500">Low</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-bold text-green-600">{stats.rangeBreakdown.normal}</div>
              <div className="text-green-500">Normal</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="font-bold text-yellow-600">{stats.rangeBreakdown.elevated}</div>
              <div className="text-yellow-500">Elevated</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="font-bold text-orange-600">{stats.rangeBreakdown.high}</div>
              <div className="text-orange-500">High</div>
            </div>
            <div className="text-center p-2 bg-red-100 rounded">
              <div className="font-bold text-red-800">{stats.rangeBreakdown.criticalHigh}</div>
              <div className="text-red-600">Critical High</div>
            </div>
          </div>
        </div>

        {/* Meal Timing Analysis */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Utensils className="w-4 h-4 mr-2" />
            Meal Timing Analysis
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            {Object.entries(stats.mealStats).map(([meal, count], i) => (
              <div key={i} className="text-center p-2 bg-white rounded border">
                <div className="text-lg">{getMealIcon(meal)}</div>
                <div className="font-bold text-blue-600">{count}</div>
                <div className="text-blue-500 capitalize">{meal.replace('_', ' ').toLowerCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Medication Correlation */}
        {stats.medicationStats.withMedication > 0 && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <Pill className="w-4 h-4 mr-2" />
              Medication Impact
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-bold text-purple-600">{stats.medicationStats.avgWithMed}</div>
                <div className="text-purple-500">Avg with Medication</div>
                <div className="text-xs text-gray-500">({stats.medicationStats.withMedication} readings)</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-bold text-gray-600">{stats.medicationStats.avgWithoutMed}</div>
                <div className="text-gray-500">Avg without Medication</div>
                <div className="text-xs text-gray-500">({stats.medicationStats.withoutMedication} readings)</div>
              </div>
            </div>
          </div>
        )}

        {/* Symptoms Alert */}
        {stats.symptomsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Symptoms Reported</h4>
                <p className="text-sm text-yellow-700">
                  {stats.symptomsCount} reading{stats.symptomsCount > 1 ? 's' : ''} reported symptoms. Consider
                  discussing these patterns with your veterinarian.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Recent Readings */}
      <motion.div variants={itemVariants} className="mt-6">
        <h4 className="font-medium text-gray-700 mb-4 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Recent Readings
        </h4>
        <div className="space-y-3">
          {bloodSugarData
            ?.slice(-5)
            .reverse()
            .map((reading: BloodSugarReading, index: number) => {
              const status = getBloodSugarStatus(Number(reading.value))
              const isOutOfRange = Number(reading.value) < 80 || Number(reading.value) > 150

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 sm:p-4 rounded-xl border ${status.bgColor} ${
                    isOutOfRange ? 'border-red-200' : 'border-pink-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-lg">{getMealIcon(reading.mealRelation)}</span>
                        <h4 className="font-semibold text-gray-900">Blood Sugar Reading</h4>
                        {reading.medicationGiven && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center space-x-1">
                            <Pill className="w-3 h-3" />
                            <span>Medication</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{reading.value} mg/dL</span> •
                          <span className={`ml-1 ${status.color}`}>{status.priority}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {reading.date} at {reading.time} • {reading?.mealRelation?.replace?.('_', ' ')?.toLowerCase()}
                        </p>
                        {reading.symptoms && reading.symptoms !== 'None observed' && (
                          <p className="text-xs text-red-600 flex items-start space-x-1">
                            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>Symptoms: {reading.symptoms}</span>
                          </p>
                        )}
                        {reading.notes && (
                          <p className="text-xs text-gray-600 flex items-start space-x-1">
                            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="italic">Notes: {reading.notes}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-start sm:self-center">
                      <status.icon className={`w-5 h-5 ${status.color.replace('text-', 'text-')}`} />
                    </div>
                  </div>
                </motion.div>
              )
            }) || <p className="text-gray-500 text-center py-8">No blood sugar readings recorded</p>}
        </div>
      </motion.div>
    </div>
  )
}

export default LargeBloodSugarGraph
