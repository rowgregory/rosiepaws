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

  if (!inputs?.timeRecorded?.trim()) {
    newErrors.timeRecorded = 'Please select when the pet was fed'
  }
  if (!inputs?.moodRating?.trim()) {
    newErrors.moodRating = 'Please select a mood'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateFeedingForm
