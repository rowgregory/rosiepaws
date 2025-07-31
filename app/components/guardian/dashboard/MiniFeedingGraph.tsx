import { parseFraction } from '@/app/lib/utils'
import { Utensils } from 'lucide-react'
import React, { FC } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const MiniFeedingGraph: FC<{ feedings: any }> = ({ feedings }) => {
  if (feedings?.length === 0 || feedings === null || feedings === undefined) return

  const foodTypeData =
    feedings?.reduce((acc: any, feeding: any) => {
      const existing = acc.find((item: any) => item.foodType === feeding.foodType)
      const amount = parseFraction(feeding.foodAmount)
      console.log(amount)

      if (existing) {
        existing.count += 1
        existing.amount += amount
        existing.feedings.push(feeding) // Keep track of individual feedings
      } else {
        acc.push({
          foodType: feeding.foodType,
          count: 1,
          amount: amount,
          feedings: [feeding]
        })
      }
      return acc
    }, []) || []
  console.log('foodTypeData: ', foodTypeData)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Food Type Distribution</h3>
            <p className="text-sm text-gray-500">Feeding breakdown</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {foodTypeData.reduce((sum: any, item: any) => sum + Number(item.amount), 0)} cups
          </div>
          <div className="text-sm text-gray-500">Today</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={foodTypeData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
            >
              {foodTypeData.map((entry: any, index: any) => {
                // Green/emerald theme colors for food types
                const greenColors = [
                  '#10b981', // emerald-500
                  '#059669', // emerald-600
                  '#22c55e', // green-500
                  '#16a34a', // green-600
                  '#15803d', // green-700
                  '#166534' // green-800
                ]
                return <Cell key={`cell-${index}`} fill={greenColors[index % greenColors.length]} />
              })}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name, props) => {
                const foodType = props.payload?.foodType?.replace?.('_', ' ')
                return [`${value} ${foodType}`, 'Count']
              }}
              labelFormatter={(label) =>
                `${
                  String(label || '')
                    .charAt(0)
                    ?.toUpperCase() || ''
                }${String(label || '').slice(1)} Food`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4">
        {foodTypeData.map((item: any, index: any) => {
          const greenColors = [
            '#10b981', // emerald-500
            '#059669', // emerald-600
            '#22c55e', // green-500
            '#16a34a', // green-600
            '#15803d', // green-700
            '#166534' // green-800
          ]
          return (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: greenColors[index % greenColors.length] }}
              ></div>
              <span className="capitalize">{item?.foodType?.replace?.('_', ' + ')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MiniFeedingGraph
