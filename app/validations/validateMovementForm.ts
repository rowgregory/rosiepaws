interface MovementFormInputs {
  petId: string
  movementType: string
  activityLevel: string
  indoor: string
  energyBefore: string
  energyAfter: string
  mobility: string
  wheelchair: string
  harness: string
  leash: string
  reluctance: string
  limping: string
  notes: string
  timeRecorded: string
}

const validateMovementForm = (inputs: MovementFormInputs, setErrors: any) => {
  const newErrors: any = {}

  // Required fields
  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select one of your pets'
  }

  if (!inputs?.movementType?.trim()) {
    newErrors.movementType = 'Please select a movement type'
  }

  if (!inputs?.activityLevel?.trim()) {
    newErrors.activityLevel = 'Please select an activity level'
  }

  if (!inputs?.timeRecorded?.trim()) {
    newErrors.timeRecorded = 'Please select when this occurred'
  }

  // Date validation
  if (inputs?.timeRecorded) {
    const selectedDate = new Date(inputs.timeRecorded)
    const now = new Date()
    if (selectedDate > now) {
      newErrors.timeRecorded = 'Movement time cannot be in the future'
    }
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isMovementFormValid = (inputs: any): boolean => {
  return !!(
    inputs?.petId &&
    inputs?.movementType &&
    inputs?.activityLevel &&
    inputs?.timeRecorded &&
    inputs?.energyBefore &&
    inputs?.energyAfter &&
    inputs?.mobility &&
    inputs?.timeRecorded
  )
}

export default validateMovementForm
