export const getFeedingMoodDescription = (rating: number) => {
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

export const getFoodTypeConfig = (foodType: string) => {
  const configs: any = {
    dry: {
      name: 'Dry Food',
      accent: 'bg-amber-500',
      avatarBg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800 border border-amber-300'
    },
    wet: {
      name: 'Wet Food',
      accent: 'bg-blue-500',
      avatarBg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800 border border-blue-300'
    },
    wet_dry: {
      name: 'Mixed',
      accent: 'bg-purple-500',
      avatarBg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800 border border-purple-300'
    }
  }
  return configs[foodType] || configs['dry'] // Default to dry food
}
