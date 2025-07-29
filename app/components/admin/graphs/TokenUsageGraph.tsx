import { COLORS } from '@/app/lib/constants'
import React, { FC } from 'react'
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const TokenUsageGraph: FC<{ data: { tokenUsage: any[] | undefined } }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Token Usage</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.tokenUsage}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value, outerRadius, midAngle, cx, cy }) => {
                const RADIAN = Math.PI / 180
                const radius = outerRadius + 22 // Distance outside the slice
                const xPos = cx + radius * Math.cos(-midAngle * RADIAN)
                const yPos = cy + radius * Math.sin(-midAngle * RADIAN)

                return (
                  <text
                    x={xPos}
                    y={yPos}
                    fill="#000"
                    textAnchor={xPos > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={12} // Make text smaller
                  >
                    {`${name}: ${value.toLocaleString()}`}
                  </text>
                )
              }}
            >
              {data?.tokenUsage?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TokenUsageGraph
