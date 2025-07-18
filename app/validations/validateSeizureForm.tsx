interface SeizureInputs {
  petId: string
  duration?: number
  timeRecorded: string
  videoFile?: File | null
}

export const validateSeizureForm = (inputs: SeizureInputs, setErrors: any) => {
  const newErrors: any = {}

  // Pet selection is required
  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Pet is required'
  }

  // Duration validation
  if (inputs?.duration !== undefined && inputs?.duration !== null) {
    const duration = Number(inputs.duration)
    if (isNaN(duration) || duration < 0 || duration > 60) {
      newErrors.duration = 'Duration must be between 0 and 60 minutes'
    }
  }

  if (!inputs?.timeRecorded?.trim()) {
    newErrors.timeRecorded = 'Please select when your last reading was'
  }

  // Video file validation (if provided)
  if (inputs?.videoFile) {
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (inputs.videoFile.size > maxSize) {
      newErrors.videoFile = 'Video file must be less than 100MB'
    }

    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime']
    if (!allowedTypes.includes(inputs.videoFile.type)) {
      newErrors.videoFile = 'Video must be MP4, MOV, or AVI format'
    }
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isSeizureFormValid = (inputs: SeizureInputs) => {
  return inputs.petId && inputs.duration && inputs.timeRecorded
}
