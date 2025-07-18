import { PainScore } from '@/app/types/entities'
import { petInitialState } from './pet'

export const painScoreInitialState: PainScore = {
  id: '',
  score: -1,
  petId: '',
  timeRecorded: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
export const painScoreInitialErrorState: PainScore = {
  id: '',
  score: 0,
  petId: '',
  timeRecorded: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
