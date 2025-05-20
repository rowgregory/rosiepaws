import { BloodSugar } from '@/app/types/model.types'

export const bloodSugarInitialState: BloodSugar = {
  id: '',
  value: 0,
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
