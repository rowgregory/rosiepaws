import { PainScore } from '@/app/types/entities'
import { petInitialState } from './pet'

export const painScoreInitialState: PainScore = {
  id: '',
  tempId: '',
  score: 2,
  petId: '',
  timeRecorded: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
export const painScoreInitialErrorState: PainScore = {
  id: '',
  tempId: '',
  score: 0,
  petId: '',
  timeRecorded: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
