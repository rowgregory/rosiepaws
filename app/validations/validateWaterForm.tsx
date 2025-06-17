interface WaterIntakeFormInputs {
  petId: string
  intakeType: string // 'milliliters' or 'relative'
  milliliters: string // string to match form input, will parse to int
  relativeIntake: string // 'more', 'same', 'less'
  timeRecorded: string
  moodRating: string // string to match form input, will parse to int
  notes?: string
}

const validateWaterIntakeForm = (
  inputs: WaterIntakeFormInputs,
  setErrors: (errors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select a pet'
  }

  if (!inputs?.intakeType?.trim()) {
    newErrors.intakeType = 'Please select a measurement type'
  }

  if (inputs.intakeType === 'milliliters') {
    const millilitersNum = Number(inputs.milliliters)
    if (!inputs.milliliters?.trim()) {
      newErrors.milliliters = 'Please enter water amount in milliliters'
    } else if (isNaN(millilitersNum) || millilitersNum < 0 || millilitersNum > 5000) {
      newErrors.milliliters = 'Amount must be a number between 0 and 5000 mL'
    }
  } else if (inputs.intakeType === 'relative') {
    if (!inputs.relativeIntake?.trim()) {
      newErrors.relativeIntake = 'Please select a relative intake amount'
    }
  }

  if (!inputs?.timeRecorded?.trim()) {
    newErrors.timeRecorded = 'Please select when the water intake occurred'
  }

  const moodRatingNum = Number(inputs.moodRating)
  if (inputs.moodRating === '' || inputs.moodRating === undefined) {
    newErrors.moodRating = 'Please rate how willing your pet was to drink'
  } else if (isNaN(moodRatingNum) || moodRatingNum < 0 || moodRatingNum > 4) {
    newErrors.moodRating = 'Please select a valid mood rating'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateWaterIntakeForm
