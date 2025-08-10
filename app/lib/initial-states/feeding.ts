import { IFeeding } from '@/app/types/entities'
import { petInitialState } from './pet'

export const feedingInitialState: IFeeding = {
  id: '',
  timeRecorded: '',
  foodType: 'dry',
  foodAmount: '1/4',
  notes: '',
  moodRating: '4',
  petId: '',
  ingredients: '',
  brand: 'royal-canin',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
