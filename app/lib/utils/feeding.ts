import { IFeeding } from '@/app/types/entities'

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

export const getTodaysFeedings = (feedings: IFeeding[]) => {
  const today = new Date().toDateString()
  return feedings.filter((feeding) => new Date(feeding.createdAt).toDateString() === today).length
}

export const isFeedingFormValid = (inputs: any) => {
  return (
    inputs?.petId && inputs?.foodType && inputs?.foodAmount && inputs?.timeRecorded && inputs.moodRating && inputs.brand
  )
}

// Helper function to convert food amounts to numeric values (in cups)
export const convertToNumeric = (amount: string): number => {
  const conversions: { [key: string]: number } = {
    '1/4': 0.25,
    '1/2': 0.5,
    '3/4': 0.75,
    '1': 1,
    '1.25': 1.25,
    '1.5': 1.5,
    '1.75': 1.75,
    '2': 2
  }
  return conversions[amount] || 0
}

// Process feeding data to get daily totals
export const processFeedingData = (feedingData: any[]) => {
  if (!feedingData || feedingData.length === 0) return []

  const dailyTotals: { [key: string]: { amount: number; types: Set<string> } } = {}

  feedingData.forEach((feeding) => {
    // Use the date field directly from your new data structure
    const date = feeding.date
    const amount = convertToNumeric(feeding.amount)
    const foodType = feeding.type

    if (dailyTotals[date]) {
      dailyTotals[date].amount += amount
      dailyTotals[date].types.add(foodType)
    } else {
      dailyTotals[date] = {
        amount: amount,
        types: new Set([foodType])
      }
    }
  })

  return Object.entries(dailyTotals)
    .map(([date, data]) => ({
      date,
      amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
      cups: `${Math.round(data.amount * 100) / 100} cups`,
      types: Array.from(data.types).join(', '), // Show food types for tooltip
      feedingCount: feedingData.filter((f) => f.date === date).length
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Alternative: Process for individual feeding times (not daily totals)
export const processFeedingDataByTime = (feedingData: any[]) => {
  if (!feedingData || feedingData.length === 0) return []

  return feedingData
    .map((feeding) => ({
      date: feeding.date,
      time: feeding.time,
      amount: convertToNumeric(feeding.amount),
      cups: `${convertToNumeric(feeding.amount)} cups`,
      type: feeding.type,
      displayTime: new Date(`${feeding.date} ${feeding.time}`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }))
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
}

export const parseFraction = (fractionStr: string): number => {
  if (!fractionStr) return 0

  const str = fractionStr.trim()

  // Handle whole numbers (e.g., "2", "3")
  if (!str.includes('/')) {
    return parseFloat(str) || 0
  }

  // Handle mixed numbers (e.g., "1 1/2", "2 3/4")
  if (str.includes(' ')) {
    const parts = str.split(' ')
    const wholeNumber = parseFloat(parts[0]) || 0
    const fractionPart = parts[1]

    if (fractionPart && fractionPart.includes('/')) {
      const [numerator, denominator] = fractionPart.split('/')
      const fractionValue = (parseFloat(numerator) || 0) / (parseFloat(denominator) || 1)
      return wholeNumber + fractionValue
    }

    return wholeNumber
  }

  // Handle simple fractions (e.g., "1/2", "3/4")
  const [numerator, denominator] = str.split('/')
  return (parseFloat(numerator) || 0) / (parseFloat(denominator) || 1)
}
