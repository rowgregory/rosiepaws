import { PainScore } from '@/app/types/model.types'
import { petInitialState } from './pet'

export const painScoreInitialState: PainScore = {
  id: '',
  score: 0,
  petId: '',
  timeRecorded: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
