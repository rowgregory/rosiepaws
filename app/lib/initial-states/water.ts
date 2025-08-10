import { IWater } from '@/app/types'
import { petInitialState } from './pet'

export const waterInitialState: IWater = {
  id: '',
  petId: '',
  intakeType: 'milliliters',
  milliliters: '150',
  timeRecorded: '',
  moodRating: '4',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
