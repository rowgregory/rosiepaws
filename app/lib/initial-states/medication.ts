import { IMedication } from '@/app/types'
import { petInitialState } from './pet'

export const medicationInitialState: IMedication & { drugInputType: string } = {
  id: '',
  drugInputType: 'search',
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

export const medicationInitialErrorState: IMedication & { drugInputType: string } = {
  id: '',
  drugInputType: '',
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
