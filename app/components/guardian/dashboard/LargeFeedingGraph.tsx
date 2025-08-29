import { FC } from 'react'
import { ResponsiveContainer, Tooltip, ComposedChart, CartesianGrid, XAxis, YAxis, Line, Legend, Bar } from 'recharts'
import { Utensils } from 'lucide-react'
import { parseFoodAmount } from '@/app/lib/utils/public/dashboard/parseFoodAmount'

const LargeFeedingGraph: FC<{ feedingData: any; showIndividualFeedings?: boolean }> = ({ feedingData }) => {
  // Process data to separate wet, dry, and mixed feedings
  const processedData = feedingData.map(
    (item: { foodAmount: any; displayTime: any; time: any; foodType: string }, index: number) => {
      const parsedAmount = parseFoodAmount(item.foodAmount)

      return {
        ...item,
        timeLabel: item.displayTime || item.time,
        wetAmount: item.foodType === 'wet' ? parsedAmount : 0,
        dryAmount: item.foodType === 'dry' ? parsedAmount : 0,
        mixedAmount: item.foodType === 'wet_dry' ? parsedAmount : 0,
        totalAmount: parsedAmount,
        // Calculate running totals with parsed amounts
        runningTotal: feedingData.slice(0, index + 1).reduce((sum: number, feeding: { foodAmount: any }) => {
          return sum + parseFoodAmount(feeding.foodAmount)
        }, 0)
      }
    }
  )

  const reversed = [...processedData]?.reverse()

  const latestAmount = processedData?.[0]?.totalAmount || 0

  // Enhanced analytics
  const moodTrend =
    processedData.length > 1
      ? processedData[0]?.moodRating > processedData[processedData.length - 1]?.moodRating
        ? 'improving'
        : 'declining'
      : 'stable'

  const mostCommonFoodType = processedData.reduce((acc: any, curr: any) => {
    const foodType = curr.foodType || 'unknown'
    acc[foodType] = (acc[foodType] || 0) + 1
    return acc
  }, {})

  const averageMoodRating =
    processedData.length > 0 && processedData.some((item: any) => item.moodRating)
      ? (
          processedData.reduce((sum: number, item: any) => sum + (item.moodRating || 0), 0) / processedData.length
        )?.toFixed(1)
      : '--'

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Advanced Feeding Analytics</h3>
            <p className="text-sm text-gray-600">Detailed feeding patterns with wet/dry breakdown and trends</p>
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:text-right">
          <div className="text-2xl font-bold text-green-600">{latestAmount}</div>
          <div className="text-sm text-gray-500">Latest Amount (cups)</div>
          <div className="text-xs text-gray-400">Mood trend: {moodTrend}</div>
        </div>
      </div>

      {/* Emerald Green Theme Bar Chart with Gradients */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={reversed} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <defs>
            <linearGradient id="dryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="wetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#6ee7b7" opacity={0.3} />

          <XAxis dataKey="timeLabel" angle={-45} textAnchor="end" height={60} tick={{ fill: '#047857' }} />

          <YAxis
            yAxisId="amount"
            label={{ value: 'Food (cups)', angle: -90, position: 'insideLeft', style: { fill: '#047857' } }}
            tick={{ fill: '#047857' }}
          />

          <YAxis
            yAxisId="mood"
            orientation="right"
            domain={[0, 5]}
            label={{ value: 'Mood (1-5)', angle: 90, position: 'insideRight', style: { fill: '#047857' } }}
            tick={{ fill: '#047857' }}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div
                    style={{
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#047857',
                      padding: '10px'
                    }}
                  >
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
                    {payload.map((entry, index) => {
                      // Only show if value exists and is greater than 0
                      if (entry.value && +entry.value > 0) {
                        const name = String(entry.name || '')
                        return (
                          <p key={index} style={{ margin: '2px 0', color: entry.color }}>
                            {entry.name}: {entry.value}
                            {name?.includes?.('Food') ? ' cups' : ''}
                          </p>
                        )
                      }
                      return null
                    })}
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            wrapperStyle={{ color: '#047857' }}
            iconType="rect"
            formatter={(value) => {
              if (value === 'Dry Food') return <span style={{ color: '#10b981' }}>{value}</span>
              if (value === 'Wet Food') return <span style={{ color: '#22c55e' }}>{value}</span>
              if (value === 'Mood Rating') return <span style={{ color: '#14b8a6' }}>{value}</span>
              return value
            }}
          />

          {/* Stacked bars with gradients */}
          <Bar
            yAxisId="amount"
            dataKey="dryAmount"
            stackId="food"
            fill="url(#dryGradient)"
            stroke="#059669"
            strokeWidth={1}
            name="Dry Food"
          />

          <Bar
            yAxisId="amount"
            dataKey="wetAmount"
            stackId="food"
            fill="url(#wetGradient)"
            stroke="#16a34a"
            strokeWidth={1}
            name="Wet Food"
          />
          <Bar
            yAxisId="amount"
            dataKey="mixedAmount"
            stackId="food"
            fill="url(#greenGradient)"
            stroke="#16a34a"
            strokeWidth={1}
            name="Wet & Dry Food"
          />

          {/* Mood line with teal gradient dots */}
          <Line
            yAxisId="mood"
            dataKey="moodRating"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{ r: 6, fill: 'url(#tealGradient)', stroke: '#0f766e', strokeWidth: 2 }}
            name="Mood Rating"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{processedData?.length || 0}</div>
          <div className="text-xs text-gray-600">Total Feedings</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {Number(
              processedData.reduce((sum: any, item: { wetAmount: any }) => sum + parseFoodAmount(item.wetAmount), 0)
            )?.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Wet Food (cups)</div>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-lg font-bold text-amber-600">
            {Number(
              processedData.reduce((sum: any, item: { dryAmount: any }) => sum + Number(item.dryAmount), 0)
            )?.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Dry Food (cups)</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{averageMoodRating}</div>
          <div className="text-xs text-gray-600">Avg Mood</div>
        </div>
      </div>

      {/* Feeding Pattern Analysis */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-4">Feeding Pattern Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Food Type Distribution</h5>
            <div className="space-y-1">
              {Object.entries(mostCommonFoodType)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([foodType, count]) => (
                  <div key={foodType} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{foodType.replace('_', ' & ')}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Feeding Frequency</h5>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {processedData.length > 0 ? (24 / processedData.length)?.toFixed(1) : '--'}h
            </div>
            <div className="text-xs text-gray-600">Average time between feedings</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Mood Trend</h5>
            <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">{moodTrend}</div>
            <div className="text-xs text-gray-600">Overall mood direction</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeFeedingGraph
