interface BloodSugarFormInputs {
  petId: string
  value: string // string to match form input, will parse to int
  timeTaken: string
}

// Pass existingEntriesCount to check how many readings for this pet today
const validateBloodSugarForm = (inputs: BloodSugarFormInputs, setErrors: (errors: Record<string, string>) => void) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select a pet'
  }

  const valueNum = Number(inputs.value)
  if (!inputs.value?.trim()) {
    newErrors.value = 'Please enter a blood sugar value'
  } else if (isNaN(valueNum) || valueNum < 0 || valueNum > 500) {
    newErrors.value = 'Value must be a number between 0 and 500'
  }

  if (!inputs?.timeTaken?.trim()) {
    newErrors.timeTaken = 'Please select when your last reading was'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateBloodSugarForm
