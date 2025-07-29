export const getWalkMoodDescription = (rating: number) => {
  switch (rating) {
    case 0:
    case undefined:
    case null:
      return 'How was their mood on the walk?'
    case 1:
      return 'Dragging behind, not interested'
    case 2:
      return 'Calm and steady'
    case 3:
      return 'Alert and engaged'
    case 4:
      return 'Bouncing with excitement!'
    default:
      return 'How was their mood on the walk?'
  }
}

// Helper function to get pace color
export const getPaceColor = (pace: string) => {
  const paceValue = pace.toLowerCase()
  if (paceValue.includes('fast') || paceValue.includes('brisk')) {
    return 'bg-orange-100 text-orange-800 border-orange-200'
  } else if (paceValue.includes('moderate') || paceValue.includes('normal')) {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  } else {
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
