import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Water } from '../types/model.types'

export const formatTimeAgo = (dateStr: any) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const getMoodEmoji = (rating: string) => {
  const emojis = ['😫', '😕', '😐', '😊', '😄']
  return emojis[parseInt(rating)] || '😐'
}

export const getRelativeIcon = (relative: string) => {
  switch (relative) {
    case 'more':
      return <TrendingUp className="text-blue-500" size={16} />
    case 'less':
      return <TrendingDown className="text-orange-500" size={16} />
    case 'same':
      return <Minus className="text-green-500" size={16} />
    default:
      return null
  }
}

export const getIntakeTypeColor = (type: string) => {
  return type === 'milliliters'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-purple-50 text-purple-700 border-purple-200'
}

export const getTodaysLogs = (waters: Water[]) => {
  const today = new Date().toDateString()
  return waters?.filter((log) => new Date(log?.createdAt).toDateString() === today).length
}
