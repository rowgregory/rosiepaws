import { Medication } from '@/app/types/model.types'
import { petInitialState } from './pet'

export const medicationInitialState: Medication = {
  id: '',
  drugName: '',
  dosage: '',
  dosageUnit: '',
  frequency: '',
  customFrequency: '',
  startDate: '',
  endDate: '',
  reminderEnabled: false,
  reminderTimes: [],
  instructions: '',
  prescribedBy: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
