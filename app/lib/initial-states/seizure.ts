import { ISeizure } from '@/app/types/entities'
import { petInitialState } from './pet'

export const seizureInitialState: ISeizure = {
  id: '',
  timeRecorded: '',
  duration: 0,
  notes: '',
  petId: '',
  videoFilename: '',
  videoUrl: '',
  seizureType: 'GENERALIZED',
  severity: 'MILD',
  triggerFactor: '',
  recoveryTime: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  pet: petInitialState
}
