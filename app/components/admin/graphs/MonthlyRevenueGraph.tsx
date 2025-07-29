import React, { FC } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import CustomTooltip from '../common/CustomToolTip'

const MonthlyRevenueGraph: FC<{ data: { revenueByMonth: any | undefined } }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.revenueByMonth?.slice(-6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1f2937"
              strokeWidth={2}
              dot={{ fill: '#1f2937', strokeWidth: 2, r: 3 }}
              name="Revenue ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MonthlyRevenueGraph
