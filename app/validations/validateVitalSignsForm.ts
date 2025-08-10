import { NORMAL_RANGES } from '../lib/constants'

interface VitalSignsFormInputs {
  petId: string
  temperature: number
  heartRate: number
  respiratoryRate: number
  weight: number
  hydrationStatus: string
  timeRecorded: string
}

const validateVitalSignsForm = (inputs: VitalSignsFormInputs, setErrors: (errors: Record<string, string>) => void) => {
  const newErrors: Record<string, string> = {}

  // Pet selection validation
  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select a pet'
  }

  // Temperature validation
  if (!inputs.temperature) {
    newErrors.temperature = 'Please enter a temperature'
  }
  // Heart rate validation
  if (!inputs.heartRate) {
    newErrors.heartRate = 'Please enter a heart rate'
  }

  // Respitory rate validation
  if (!inputs.respiratoryRate) {
    newErrors.respiratoryRate = 'Please enter a respitory rate'
  }

  // Hydration status selection validation
  if (!inputs?.hydrationStatus?.trim()) {
    newErrors.hydrationStatus = 'Please select a hydration status'
  }

  // Time recorded validation
  if (!inputs?.timeRecorded?.trim()) {
    newErrors.timeRecorded = 'Please select when you check their vital signs'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isVitalSignsFormValid = (inputs: any) => {
  return (
    inputs?.petId &&
    inputs.temperature &&
    inputs.heartRate &&
    inputs.respiratoryRate &&
    inputs?.hydrationStatus &&
    inputs?.timeRecorded
  )
}

export const isVitalSignNormal = (
  vitalType: 'temperature' | 'heartRate' | 'respiratoryRate',
  value: number,
  petType: string
): boolean => {
  if (!value || !petType) return true // Assume normal if no value or pet type

  const ranges = NORMAL_RANGES[petType.toUpperCase() as keyof typeof NORMAL_RANGES]
  if (!ranges) return true // Assume normal if no range available

  const range = ranges[vitalType]
  if (!range) return true // Assume normal if specific vital type range not found

  return value >= range.min && value <= range.max
}

export default validateVitalSignsForm
