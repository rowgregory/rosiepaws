export const FOOD_TYPES = [
  { id: 'dry', name: 'Dry Food', icon: '🥘', color: 'bg-amber-50 border-amber-300 text-amber-700' },
  { id: 'wet', name: 'Wet Food', icon: '🥫', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { id: 'wet_dry', name: 'Wet + Dry', icon: '🍽️', color: 'bg-green-50 border-green-300 text-green-700' }
] as const

export type FoodType = (typeof FOOD_TYPES)[number]['id']

export const AMOUNTS = [
  { id: '1/4', label: '1/4 Cup', visual: '▪' },
  { id: '1/2', label: '1/2 Cup', visual: '▪▪' },
  { id: '3/4', label: '3/4 Cup', visual: '▪▪▪' },
  { id: '1', label: '1 Cup', visual: '▪▪▪▪' },
  { id: '1.25', label: '1 1/4 Cups', visual: '▪▪▪▪▪' },
  { id: '1.5', label: '1 1/2 Cups', visual: '▪▪▪▪▪▪' },
  { id: '1.75', label: '1 3/4 Cups', visual: '▪▪▪▪▪▪▪' },
  { id: '2', label: '2 Cups', visual: '▪▪▪▪▪▪▪▪' }
]

export const POPULAR_BRANDS = [
  { id: 'royal-canin', name: 'Royal Canin', icon: '🏆' },
  { id: 'hills', name: "Hill's", icon: '🏔️' },
  { id: 'purina', name: 'Purina Pro Plan', icon: '🥇' },
  { id: 'blue-buffalo', name: 'Blue Buffalo', icon: '🦬' },
  { id: 'wellness', name: 'Wellness', icon: '💚' },
  { id: 'orijen', name: 'Orijen', icon: '🌿' },
  { id: 'homemade', name: 'Homemade', icon: '🏠' },
  { id: 'raw', name: 'Raw Diet', icon: '🥩' },
  { id: 'other', name: 'Other', icon: '📝' }
]
