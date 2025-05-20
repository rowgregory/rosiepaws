interface PainScoreInputs {
  petId: string
  score: number
}

export const validatePainScoreForm = (inputs: PainScoreInputs, setErrors: any) => {
  const newErrors: any = {}

  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Pet is required'
  }
  if (!inputs?.score?.toString().trim()) {
    newErrors.score = 'Score is required'
  } else {
    const num = Number(inputs.score)
    if (isNaN(num) || num < 0 || num > 4) {
      newErrors.score = 'Score must be a number between 0 and 4'
    }
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isPainScoreFormValid = (inputs: PainScoreInputs) => {
  const score = Number(inputs.score)
  return !isNaN(score) && score >= 0 && score <= 4
}
