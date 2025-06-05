import { IFeeding } from '@/app/types/model.types'
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
const processFeedingData = (feedingData: IFeeding[]) => {
  const dailyTotals: { [key: string]: number } = {}

  feedingData.forEach((feeding) => {
    const date = new Date(feeding.timeFed).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
    const amount = convertToNumeric(feeding.foodAmount)

    if (dailyTotals[date]) {
      dailyTotals[date] += amount
    } else {
      dailyTotals[date] = amount
    }
  })

  return Object.entries(dailyTotals)
    .map(([date, total]) => ({
      date,
      amount: Math.round(total * 100) / 100, // Round to 2 decimal places
      cups: `${Math.round(total * 100) / 100} cups`
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

const GuardianFeedingGraph: FC<{ feedingData: IFeeding[] }> = ({ feedingData }) => {
  const chartData = processFeedingData(feedingData)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Feeding</h3>
        <p className="text-sm text-gray-600">Smooth trend of daily consumption</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
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
            formatter={(value: number) => [`${value} cups`, 'Daily Intake']}
          />
          <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GuardianFeedingGraph
