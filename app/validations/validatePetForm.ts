interface ValidationErrors {
  name: string
  type: string
  breed: string
  age: string
  gender: string
  weight: string
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
  if (!inputs?.age?.trim()) {
    newErrors.age = 'Age is required'
  }
  if (!inputs?.gender?.trim()) {
    newErrors.gender = 'Gender is required'
  } else if (inputs?.gender === 'Select gender') {
    newErrors.gender = 'Gender is required'
  }
  if (!inputs?.weight?.trim()) {
    newErrors.weight = 'Weight is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isPetFormValid = (inputs: ValidationErrors) => {
  return (
    !!inputs.name?.trim() &&
    !!inputs.type?.trim() &&
    !!inputs.breed?.trim() &&
    !!inputs.age?.trim() &&
    !!inputs.gender?.trim() &&
    !!inputs.weight?.trim()
  )
}
