import { FC } from 'react'
import { ResponsiveContainer, Tooltip, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts'

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

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Feeding</h3>
        <p className="text-sm text-gray-600">
          {showIndividualFeedings ? 'Individual feeding amounts over time' : 'Smooth trend of daily consumption'}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={showIndividualFeedings ? 'displayTime' : 'date'}
            tick={{ fontSize: 12 }}
            tickLine={false}
            angle={showIndividualFeedings ? -45 : 0}
            textAnchor={showIndividualFeedings ? 'end' : 'middle'}
            height={showIndividualFeedings ? 60 : 30}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            label={{ value: 'Cups', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
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
          <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Optional: Show feeding summary */}
      {chartData.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 flex justify-between">
          <span>Total feedings: {feedingData?.length || 0}</span>
          <span>
            Total amount: {Math.round(chartData.reduce((sum, item) => sum + item.amount, 0) * 100) / 100} cups
          </span>
        </div>
      )}
    </div>
  )
}

export default GuardianFeedingGraph
