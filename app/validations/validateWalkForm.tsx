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
  if (!inputs?.moodRating?.trim()) {
    newErrors.moodRating = 'Please select a mood'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateWalkForm
