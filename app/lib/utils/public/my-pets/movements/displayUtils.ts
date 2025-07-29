import { Activity, Heart, HelpingHand, LifeBuoy, Zap } from 'lucide-react'

export const getMovementTypeIcon = (type: string) => {
  switch (type) {
    case 'WALK':
      return { icon: Activity, color: 'text-blue-500' }
    case 'RUN':
      return { icon: Zap, color: 'text-green-500' }
    case 'SWIM':
      return { icon: Activity, color: 'text-cyan-500' }
    case 'PHYSICAL_THERAPY':
      return { icon: Heart, color: 'text-purple-500' }
    case 'WHEELCHAIR_MOBILITY':
      return { icon: LifeBuoy, color: 'text-orange-500' }
    case 'ASSISTED_WALKING':
      return { icon: HelpingHand, color: 'text-indigo-500' }
    default:
      return { icon: Activity, color: 'text-gray-500' }
  }
}

// Get activity level color
export const getActivityLevelColor = (level: string) => {
  switch (level) {
    case 'VERY_LOW':
      return 'bg-gray-100 text-gray-600 border-gray-200'
    case 'LOW':
      return 'bg-blue-100 text-blue-600 border-blue-200'
    case 'MODERATE':
      return 'bg-yellow-100 text-yellow-600 border-yellow-200'
    case 'HIGH':
      return 'bg-orange-100 text-orange-600 border-orange-200'
    case 'VERY_HIGH':
      return 'bg-red-100 text-red-600 border-red-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}
