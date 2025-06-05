import { IFeeding } from '@/app/types/model.types'
import { petInitialState } from './pet'

export const feedingInitialState: IFeeding = {
  id: '',
  timeFed: '',
  foodType: '',
  foodAmount: '',
  notes: '',
  moodRating: '0',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
