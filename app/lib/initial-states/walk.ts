import { Walk } from '@/app/types/model.types'

export const walkInitialState: Walk = {
  id: '',
  duration: 0,
  timeWalked: new Date(),
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
