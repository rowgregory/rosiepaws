import { Activity } from 'lucide-react'

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend
}: {
  title: string
  value: string | number
  icon: any
  subtitle?: string
  trend?: { value: number; isPositive: boolean }
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1">
              <Activity className={`w-3 h-3 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default StatCard
