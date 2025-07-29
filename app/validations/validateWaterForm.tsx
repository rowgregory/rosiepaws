interface WaterIntakeFormInputs {
  petId: string
  intakeType: string // 'milliliters'
  milliliters: string
  timeRecorded: string
  moodRating: string
}

const validateWaterIntakeForm = (
  inputs: WaterIntakeFormInputs,
  setErrors: (errors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select a pet'
  }

  const millilitersNum = Number(inputs.milliliters)
  if (!inputs.milliliters?.trim()) {
    newErrors.milliliters = 'Please enter water amount in milliliters'
  } else if (isNaN(millilitersNum) || millilitersNum < 0 || millilitersNum > 5000) {
    newErrors.milliliters = 'Amount must be a number between 0 and 5000 mL'
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

export const isWaterFormValid = (inputs: any) => {
  return inputs?.petId && inputs?.timeRecorded && inputs?.milliliters && inputs?.moodRating
}

export default validateWaterIntakeForm
