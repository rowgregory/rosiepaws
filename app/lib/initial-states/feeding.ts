import { IFeeding } from '@/app/types/entities'
import { petInitialState } from './pet'

export const feedingInitialState: IFeeding = {
  id: '',
  timeRecorded: '',
  foodType: '',
  foodAmount: '',
  notes: '',
  moodRating: '0',
  petId: '',
  ingredients: '',
  brand: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
