import { Clock, Crown, Heart, Shield, Star, Users } from 'lucide-react'

interface IPartialUser {
  isSuperUser: any
  isAdmin: any
  isCompanionUser: any
  isComfortUser: any
  isLegacyUser: any
}

export const getUserTypeColor = (user: IPartialUser) => {
  if (user.isSuperUser) return 'bg-red-100 text-red-800 border-red-200'
  if (user.isAdmin) return 'bg-purple-100 text-purple-800 border-purple-200'
  if (user.isCompanionUser) return 'bg-blue-100 text-blue-800 border-blue-200'
  if (user.isComfortUser) return 'bg-green-100 text-green-800 border-green-200'
  if (user.isLegacyUser) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getUserTypeIcon = (user: IPartialUser) => {
  if (user.isSuperUser) return <Crown className="w-3 h-3" />
  if (user.isAdmin) return <Shield className="w-3 h-3" />
  if (user.isCompanionUser) return <Heart className="w-3 h-3" />
  if (user.isComfortUser) return <Star className="w-3 h-3" />
  if (user.isLegacyUser) return <Clock className="w-3 h-3" />
  return <Users className="w-3 h-3" />
}

export const getUserTypeName = (user: IPartialUser) => {
  if (user.isSuperUser) return 'Super User'
  if (user.isAdmin) return 'Admin'
  if (user.isCompanionUser) return 'Companion'
  if (user.isComfortUser) return 'Comfort'
  if (user.isLegacyUser) return 'Legacy'
  return 'Free'
}
