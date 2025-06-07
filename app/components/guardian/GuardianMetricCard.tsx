import { ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react'

const GuardianMetricCard = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  onClick,
  isActive,
  children,
  collapsible = false,
  expandedCards,
  toggleCard
}: any) => (
  <div
    className={`transition-all duration-300 hover:scale-[1.02] rounded-2xl border-2 ${
      isActive
        ? `border-${color}-300 bg-gradient-to-br from-${color}-50 to-${color}-100`
        : 'border-gray-200 bg-white hover:border-gray-300'
    } shadow-lg hover:shadow-xl overflow-hidden`}
  >
    <div onClick={onClick} className={`${onClick ? 'cursor-pointer' : ''} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-r ${
            color === 'red'
              ? 'from-red-500 to-pink-500'
              : color === 'blue'
              ? 'from-blue-500 to-cyan-500'
              : color === 'green'
              ? 'from-green-500 to-emerald-500'
              : color === 'purple'
              ? 'from-purple-500 to-pink-500'
              : color === 'yellow'
              ? 'from-yellow-500 to-orange-500'
              : 'from-orange-500 to-amber-500'
          } shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-2">
          {trend && (
            <div
              className={`flex items-center space-x-1 ${
                trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <div className="w-4 h-1 bg-gray-400 rounded"></div>
              )}
            </div>
          )}
          {collapsible && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleCard(id)
              }}
            >
              {expandedCards.includes(id) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>

    {children && expandedCards.includes(id) && (
      <div className="border-t border-gray-200 p-6 bg-gray-50">{children}</div>
    )}
  </div>
)

export default GuardianMetricCard
