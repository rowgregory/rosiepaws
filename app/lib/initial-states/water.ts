import { IWater } from '@/app/types'
import { petInitialState } from './pet'

export const waterInitialState: IWater = {
  id: '',
  petId: '',
  intakeType: 'milliliters',
  milliliters: '',
  timeRecorded: '',
  moodRating: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
