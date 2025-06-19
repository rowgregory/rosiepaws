import { ISeizure } from '@/app/types/model.types'
import { petInitialState } from './pet'

export const seizureInitialState: ISeizure = {
  id: '',
  timeTaken: '',
  duration: 0,
  notes: '',
  petId: '',
  videoFilename: '',
  videoUrl: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
