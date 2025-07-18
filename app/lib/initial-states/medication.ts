import { IMedication } from '@/app/types'
import { petInitialState } from './pet'

export const medicationInitialState: IMedication = {
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
  sentRemindersToday: [],
  instructions: '',
  prescribedBy: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
