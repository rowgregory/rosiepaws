import { FC } from 'react'
import { ResponsiveContainer, Tooltip, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts'
import { Utensils } from 'lucide-react'
import { processFeedingDataByTime } from '@/app/lib/utils'

const LargeFeedingGraph: FC<{ feedingData: any; showIndividualFeedings?: boolean }> = ({
  feedingData,
  showIndividualFeedings = false
}) => {
  // Choose between daily totals or individual feedings
  const chartData = showIndividualFeedings
    ? processFeedingDataByTime(feedingData)
    : processFeedingDataByTime(feedingData)

  const latestAmount = chartData?.[0]?.amount || 0
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0)
  const averageAmount = chartData.length > 0 ? (totalAmount / chartData.length).toFixed(1) : '--'

  // Add these to your component calculations
  const mostCommonFoodType =
    feedingData.length > 0
      ? feedingData.reduce((acc: any, curr: any) => {
          acc[curr.foodType] = (acc[curr.foodType] || 0) + 1
          return acc
        }, {})
      : {}

  const topFoodType =
    Object.keys(mostCommonFoodType).length > 0
      ? Object.entries(mostCommonFoodType).sort(([, a], [, b]) => (b as number) - (a as number))[0][0]
      : 'No data'

  const averageMoodRating =
    feedingData.length > 0
      ? (feedingData.reduce((sum: number, item: any) => sum + item.moodRating, 0) / feedingData.length).toFixed(1)
      : '--'

  const mostCommonBrand =
    feedingData.length > 0
      ? feedingData.reduce((acc: any, curr: any) => {
          acc[curr.brand] = (acc[curr.brand] || 0) + 1
          return acc
        }, {})
      : {}

  const topBrand =
    Object.keys(mostCommonBrand).length > 0
      ? Object.entries(mostCommonBrand).sort(([, a], [, b]) => (b as number) - (a as number))[0][0]
      : 'No data'

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
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
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{averageMoodRating}</div>
          <div className="text-xs text-gray-600">Avg Mood</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600 truncate" title={topFoodType}>
            {topFoodType.length > 8 ? topFoodType.substring(0, 8) + '...' : topFoodType}
          </div>
          <div className="text-xs text-gray-600">Top Food</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600 truncate" title={topBrand}>
            {topBrand.length > 8 ? topBrand.substring(0, 8) + '...' : topBrand}
          </div>
          <div className="text-xs text-gray-600">Top Brand</div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-4">Feeding Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Food Preferences</h5>
            <div className="space-y-1">
              {Object.entries(mostCommonFoodType)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([foodType, count]) => (
                  <div key={foodType} className="flex justify-between text-sm">
                    <span className="text-gray-600">{foodType}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Brand Distribution</h5>
            <div className="space-y-1">
              {Object.entries(mostCommonBrand)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([brand, count]) => (
                  <div key={brand} className="flex justify-between text-sm">
                    <span className="text-gray-600">{brand}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeFeedingGraph
