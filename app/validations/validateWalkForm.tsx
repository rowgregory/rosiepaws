interface WalkFormInputs {
  petId: string
  distance: string
  duration: string
  pace: string
  distraction: string
  timeRecorded: string
  moodRating: string
}

const validateWalkForm = (inputs: WalkFormInputs, setErrors: (errors: Record<string, string>) => void) => {
  const newErrors: Record<string, string> = {}

  // Pet selection validation
  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select a pet'
  }

  // Distance validation
  if (!inputs.distance?.trim()) {
    newErrors.distance = 'Please enter a distance'
  }
  // Duration validation
  if (!inputs.duration?.trim()) {
    newErrors.duration = 'Please enter a duration'
  }

  // Pace validation
  const validPaces = ['slow', 'moderate', 'brisk', 'energetic']
  if (!inputs?.pace?.trim()) {
    newErrors.pace = 'Please select a walking pace'
  } else if (!validPaces.includes(inputs.pace)) {
    newErrors.pace = 'Please select a valid pace option'
  }

  // Distraction validation

  if (!inputs?.distraction?.trim()) {
    newErrors.distraction = 'Please select a distraction level'
  }

  // Time recorded validation
  if (!inputs?.timeRecorded?.trim()) {
    newErrors.timeRecorded = 'Please enter the walk duration'
  }

  // Mood rating validation
  const moodRating = Number(inputs?.moodRating)
  if (inputs?.moodRating === undefined || inputs?.moodRating === null || inputs?.moodRating === '') {
    newErrors.moodRating = 'Please select a mood rating'
  } else if (![0, 1, 2, 3, 4].includes(moodRating)) {
    newErrors.moodRating = 'Please select a mood rating between 0 and 4'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isWalkFormValid = (inputs: any) => {
  return (
    inputs?.petId &&
    inputs?.distance &&
    inputs?.duration &&
    inputs?.pace &&
    inputs?.distraction &&
    inputs?.moodRating !== undefined &&
    inputs?.timeRecorded
  )
}

export default validateWalkForm
