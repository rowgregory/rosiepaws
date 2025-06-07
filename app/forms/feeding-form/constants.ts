import { IFeeding } from '@/app/types/model.types'

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

export const getMoodDescription = (rating: number) => {
  switch (rating) {
    case 0:
    case undefined:
    case null:
      return 'How was their appetite?'
    case 1:
      return 'Not very interested'
    case 2:
      return 'Ate normally'
    case 3:
      return 'Happy to eat'
    case 4:
      return 'Very excited!'
    case 5:
      return 'Absolutely thrilled!'
    default:
      return 'How was their appetite?'
  }
}

export const MOOD_EMOJIS = ['😴', '😐', '🙂', '😋', '🤤']

export const getFoodTypeColor = (foodType: string) => {
  switch (foodType) {
    case 'Dry Food':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Wet Food':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Wet + Dry':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getTodaysFeedings = (feedings: IFeeding[]) => {
  const today = new Date().toDateString()
  return feedings.filter((feeding) => new Date(feeding.createdAt).toDateString() === today).length
}
