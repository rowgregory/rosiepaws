import { BloodSugar } from '@/app/types/model.types'
import { petInitialState } from './pet'

export const bloodSugarInitialState: BloodSugar = {
  id: '',
  value: '',
  notes: '',
  petId: '',
  timeTaken: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
