import { FC } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import CustomTooltip from '../common/CustomToolTip'

const UserGrowthGraph: FC<{ data: { userGrowth: any[] | undefined } }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.userGrowth?.slice(-6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="newUsers" fill="#374151" radius={[2, 2, 0, 0]} name="New Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default UserGrowthGraph
