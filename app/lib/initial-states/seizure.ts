import { ISeizure } from '@/app/types/model.types'
import { petInitialState } from './pet'

export const seizureInitialState: ISeizure = {
  id: '',
  occurredAt: new Date(),
  duration: undefined,
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
