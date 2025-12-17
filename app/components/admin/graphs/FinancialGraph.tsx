import { FC } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import CustomTooltip from '../common/CustomToolTip'
import { COLORS } from '@/app/lib/constants'

const FinancialGraph: FC<{ data: { mrrByPlan: any[] | undefined; paymentMethods: any[] | undefined } }> = ({
  data
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">MRR by Plan</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.mrrByPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="plan" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mrr" fill="#374151" radius={[2, 2, 0, 0]} name="MRR ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.paymentMethods}
                dataKey="count"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ method, percentage }) => `${method}: ${percentage}%`}
              >
                {data?.paymentMethods?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default FinancialGraph
