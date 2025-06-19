import { FC } from 'react'
import { ResponsiveContainer, Tooltip, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts'
import { Utensils } from 'lucide-react'

// Helper function to convert food amounts to numeric values (in cups)
const convertToNumeric = (amount: string): number => {
  const conversions: { [key: string]: number } = {
    '1/4': 0.25,
    '1/2': 0.5,
    '3/4': 0.75,
    '1': 1,
    '1.25': 1.25,
    '1.5': 1.5,
    '1.75': 1.75,
    '2': 2
  }
  return conversions[amount] || 0
}

// Process feeding data to get daily totals
const processFeedingData = (feedingData: any[]) => {
  if (!feedingData || feedingData.length === 0) return []

  const dailyTotals: { [key: string]: { amount: number; types: Set<string> } } = {}

  feedingData.forEach((feeding) => {
    // Use the date field directly from your new data structure
    const date = feeding.date
    const amount = convertToNumeric(feeding.amount)
    const foodType = feeding.type

    if (dailyTotals[date]) {
      dailyTotals[date].amount += amount
      dailyTotals[date].types.add(foodType)
    } else {
      dailyTotals[date] = {
        amount: amount,
        types: new Set([foodType])
      }
    }
  })

  return Object.entries(dailyTotals)
    .map(([date, data]) => ({
      date,
      amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
      cups: `${Math.round(data.amount * 100) / 100} cups`,
      types: Array.from(data.types).join(', '), // Show food types for tooltip
      feedingCount: feedingData.filter((f) => f.date === date).length
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Alternative: Process for individual feeding times (not daily totals)
const processFeedingDataByTime = (feedingData: any[]) => {
  if (!feedingData || feedingData.length === 0) return []

  return feedingData
    .map((feeding) => ({
      date: feeding.date,
      time: feeding.time,
      amount: convertToNumeric(feeding.amount),
      cups: `${convertToNumeric(feeding.amount)} cups`,
      type: feeding.type,
      displayTime: new Date(`${feeding.date} ${feeding.time}`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }))
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
}

const GuardianFeedingGraph: FC<{ feedingData: any; showIndividualFeedings?: boolean }> = ({
  feedingData,
  showIndividualFeedings = false
}) => {
  // Choose between daily totals or individual feedings
  const chartData = showIndividualFeedings ? processFeedingDataByTime(feedingData) : processFeedingData(feedingData)

  const latestAmount = chartData?.slice(-1)[0]?.amount || 0
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0)
  const averageAmount = chartData.length > 0 ? (totalAmount / chartData.length).toFixed(1) : '--'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Feeding Tracking</h3>
            <p className="text-sm text-gray-600">
              {showIndividualFeedings ? 'Individual feeding amounts over time' : 'Daily consumption trends'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {showIndividualFeedings ? `${latestAmount}` : `${latestAmount}`}
          </div>
          <div className="text-sm text-gray-500">{showIndividualFeedings ? 'Latest (cups)' : 'Latest Day (cups)'}</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="feedingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#50ad86" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.6} />
          <XAxis
            dataKey={showIndividualFeedings ? 'displayTime' : 'date'}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            angle={showIndividualFeedings ? -45 : 0}
            textAnchor={showIndividualFeedings ? 'end' : 'middle'}
            height={showIndividualFeedings ? 60 : 30}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Cups', angle: -90, position: 'insideLeft' }}
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
              const data = props.payload
              if (showIndividualFeedings) {
                return [`${value} cups (${data.type})`, 'Feeding Amount']
              } else {
                return [`${value} cups (${data.feedingCount} feedings)`, 'Daily Total']
              }
            }}
            labelFormatter={(label) => (showIndividualFeedings ? `Time: ${label}` : `Date: ${label}`)}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            fill="url(#feedingGradient)"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{feedingData?.length || 0}</div>
          <div className="text-xs text-gray-600">Total Feedings</div>
        </div>
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <div className="text-lg font-bold text-emerald-600">{averageAmount}</div>
          <div className="text-xs text-gray-600">Avg per Day</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-600">{Math.round(totalAmount * 100) / 100}</div>
          <div className="text-xs text-gray-600">Total Cups</div>
        </div>
      </div>
    </div>
  )
}

export default GuardianFeedingGraph
