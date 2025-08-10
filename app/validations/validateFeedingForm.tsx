interface FeedingFormInputs {
  petId: string
  foodType: string
  foodAmount: string
  timeRecorded: string
  moodRating: string
}

const validateFeedingForm = (inputs: FeedingFormInputs, setErrors: any) => {
  const newErrors: any = {}

  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select one of your pets'
  }

  if (!inputs?.foodType?.trim()) {
    newErrors.foodType = 'Please select a food type'
  }

  if (!inputs?.foodAmount?.trim()) {
    newErrors.foodAmount = 'Please specify the custom food type'
  }

  if (!inputs?.timeRecorded) {
    newErrors.timeRecorded = 'Please select when the pet was fed'
  }
  const moodRating = Number(inputs?.moodRating)
  if (inputs?.moodRating === undefined || inputs?.moodRating === null || inputs?.moodRating === '') {
    newErrors.moodRating = 'Please select a mood rating'
  } else if (![0, 1, 2, 3, 4].includes(moodRating)) {
    newErrors.moodRating = 'Please select a mood rating between 0 and 4'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isFeedingFormValid = (inputs: any) => {
  return (
    inputs?.petId && inputs?.foodType && inputs?.foodAmount && inputs?.timeRecorded && inputs.moodRating && inputs.brand
  )
}

export default validateFeedingForm
