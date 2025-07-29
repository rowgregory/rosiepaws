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
