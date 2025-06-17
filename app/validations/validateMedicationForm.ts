interface MedicationFormInputs {
  petId: string
  drugName: string
  dosage: string
  dosageUnit: string
  frequency: string
  customFrequency?: string
  startDate: string
  endDate: string
  reminderEnabled: boolean
  reminderTimes: string[]
  instructions?: string
  prescribedBy?: string
}

const validateMedicationForm = (inputs: MedicationFormInputs, setErrors: (errors: Record<string, string>) => void) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.petId?.trim()) {
    newErrors.petId = 'Please select a pet'
  }

  if (!inputs?.drugName?.trim()) {
    newErrors.drugName = 'Please enter or select a medication'
  }

  if (!inputs?.dosage?.trim()) {
    newErrors.dosage = 'Please enter the dosage amount'
  } else if (isNaN(Number(inputs.dosage)) || Number(inputs.dosage) <= 0) {
    newErrors.dosage = 'Dosage must be a positive number'
  }

  if (!inputs?.dosageUnit?.trim()) {
    newErrors.dosageUnit = 'Please select a dosage unit'
  }

  if (!inputs?.frequency?.trim()) {
    newErrors.frequency = 'Please select dosing frequency'
  } else if (inputs.frequency === 'custom' && !inputs.customFrequency?.trim()) {
    newErrors.customFrequency = 'Please specify custom frequency'
  }

  if (!inputs?.startDate?.trim()) {
    newErrors.startDate = 'Please select start date'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateMedicationForm
