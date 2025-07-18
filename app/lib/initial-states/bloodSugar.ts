import { IBloodSugar } from '@/app/types/entities'
import { petInitialState } from './pet'

export const bloodSugarInitialState: IBloodSugar = {
  id: '',
  value: '',
  notes: '',
  petId: '',
  timeRecorded: '',
  mealRelation: 'FASTING',
  measurementUnit: 'MG_DL',
  targetRange: '',
  symptoms: '',
  medicationGiven: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
