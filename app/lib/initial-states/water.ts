import { Water } from '@/app/types/model.types'
import { petInitialState } from './pet'

export const waterInitialState: Water = {
  id: '',
  petId: '',
  intakeType: '',
  milliliters: '',
  relativeIntake: '',
  timeRecorded: '',
  moodRating: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  pet: petInitialState
}
