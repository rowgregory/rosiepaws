import { SeizureActivity } from '@/app/types/model.types'

export const seizureActivityInitialState: SeizureActivity = {
  id: '',
  occurredAt: new Date(),
  duration: undefined,
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
