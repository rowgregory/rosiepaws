import { IVitalSigns } from '@/app/types'
import { petInitialState } from './pet'

export const vitalSignsInitialState: IVitalSigns = {
  id: '',
  petId: '',
  temperature: 101.5,
  heartRate: 90,
  respiratoryRate: 20,
  weight: 20,
  bloodPressure: '120/80',
  capillaryRefillTime: 'LESS_THAN_ONE_SECOND',
  mucousMembranes: 'PINK_AND_MOIST',
  hydrationStatus: 'NORMAL',
  notes: '',
  timeRecorded: '',
  pet: petInitialState,
  createdAt: new Date(),
  updatedAt: new Date()
}
