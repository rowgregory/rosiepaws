import { Crown, TrendingUp, TrendingDown, Star, Heart } from 'lucide-react'

interface GuardianMetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend?: 'up' | 'down' | 'stable'
  onClick?: () => void
  isActive: boolean
  id: string
  hasLogs: boolean
}

const getColorGradient = (color: string) => {
  const gradients = {
    red: 'from-red-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-indigo-500 to-purple-500',
    yellow: 'from-yellow-500 to-orange-500',
    gray: 'from-slate-500 to-stone-500',
    fuchsia: 'from-fuchsia-500 to-rose-500',
    cyan: 'from-cyan-500 to-slate-500',
    orange: 'from-red-500 to-orange-500'
  }
  return gradients[color as keyof typeof gradients] || gradients.orange
}

const getActiveStyles = (color: string, isActive: boolean) => {
  if (!isActive) {
    return 'border-gray-200 bg-white'
  }

  const activeStyles = {
    red: 'border-red-300 bg-red-50',
    blue: 'border-blue-300 bg-blue-50',
    green: 'border-green-300 bg-green-50',
    purple: 'border-purple-300 bg-purple-50',
    yellow: 'border-yellow-300 bg-yellow-50',
    gray: 'border-gray-300 bg-gray-50',
    fuchsia: 'border-fuchsia-300 bg-fuchsia-50',
    cyan: 'border-cyan-300 bg-cyan-50',
    orange: 'border-orange-300 bg-orange-50'
  }

  return activeStyles[color as keyof typeof activeStyles] || activeStyles.orange
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3" />
    case 'down':
      return <TrendingDown className="w-3 h-3" />
    default:
      return <div className="w-3 h-0.5 bg-gray-400 rounded" />
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'text-red-500'
    case 'down':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

const GuardianMetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  onClick,
  isActive,
  id,
  hasLogs
}: GuardianMetricCardProps) => {
  const isEmpty = !hasLogs
  const isFree = id === 'pain-scores' || id === 'feedings' || id === 'waters'
  const isComfort = id === 'vital-signs' || id === 'movements' || id === 'appointments'
  const isLegacy = id === 'medications' || id === 'blood-sugars' || id === 'seizures'

  return (
    <div
      className={`
        transition-all duration-300 hover:scale-[1.02] 
        w-full h-full
        rounded-xl border-1 shadow-md hover:shadow-lg 
        overflow-hidden relative flex flex-col
        ${isEmpty ? 'border-gray-200 bg-gray-50 opacity-60' : getActiveStyles(color, isActive)}
      `}
    >
      {/* Premium Crown */}
      {isFree && (
        <div className="absolute top-2 right-2 z-10">
          <Heart className="w-4 h-4 text-lime-500" />
        </div>
      )}
      {isComfort && (
        <div className="absolute top-2 right-2 z-10">
          <Star className="w-4 h-4 text-cyan-500" />
        </div>
      )}
      {isLegacy && (
        <div className="absolute top-2 right-2 z-10">
          <Crown className="w-4 h-4 text-purple-500" />
        </div>
      )}

      <div onClick={onClick} className={`${onClick ? 'cursor-pointer' : ''} p-4 flex flex-col h-full`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`
              p-2 rounded-lg shadow-md
              ${isEmpty ? 'bg-gray-300' : `bg-gradient-to-r ${getColorGradient(color)}`}
            `}
          >
            <Icon className={`w-4 h-4 ${isEmpty ? 'text-gray-500' : 'text-white'}`} />
          </div>

          {trend && !isEmpty && (
            <div className={`flex items-center ${getTrendColor(trend)}`}>{getTrendIcon(trend)}</div>
          )}
        </div>

        {/* Content - flex-grow to fill remaining space */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <h3 className={`text-lg font-bold ${isEmpty ? 'text-gray-400' : 'text-gray-900'}`}>
              {isEmpty ? 'No data' : value}
            </h3>
            <p className={`text-xs mt-0.5 ${isEmpty ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          </div>

          {subtitle && (
            <p className={`text-xs mt-1 ${isEmpty ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
              {isEmpty ? 'Click to add first entry' : subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuardianMetricCard
