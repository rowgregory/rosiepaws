interface ValidationErrors {
  name: string
  type: string
  breed: string
  ageYears: string
  ageMonths: string
  gender: string
  weight: string
  spayedNeutered: string
}

export const validatePetForm = (inputs: ValidationErrors, setErrors: any) => {
  const newErrors: any = {}

  if (!inputs?.name?.trim()) {
    newErrors.name = 'Name is required'
  }
  if (!inputs?.type?.trim()) {
    newErrors.type = 'Type is required'
  }
  if (!inputs?.breed?.trim()) {
    newErrors.breed = 'Breed is required'
  }
  if (!inputs?.ageYears?.trim()) {
    newErrors.ageYears = 'Years is required'
  }
  if (!inputs?.ageMonths?.trim()) {
    newErrors.ageMonths = 'Months is required'
  }
  if (!inputs?.gender?.trim()) {
    newErrors.gender = 'Gender is required'
  } else if (inputs?.gender === 'Select gender') {
    newErrors.gender = 'Gender is required'
  }
  if (!inputs?.weight?.trim()) {
    newErrors.weight = 'Weight is required'
  }
  if (!inputs?.spayedNeutered?.trim()) {
    newErrors.spayedNeutered = 'Spayed/Neutered is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isPetFormValid = (inputs: ValidationErrors) => {
  return (
    !!inputs.name?.trim() &&
    !!inputs.type?.trim() &&
    !!inputs.breed?.trim() &&
    !!inputs.ageYears?.trim() &&
    !!inputs.ageMonths?.trim() &&
    !!inputs.gender?.trim() &&
    !!inputs.weight?.trim() &&
    !!inputs.spayedNeutered?.trim()
  )
}
