import { Feeding } from '@/app/types/model.types'

export const feedingInitialState: Feeding = {
  id: '',
  timeFed: new Date(),
  foodType: '',
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
