import { Pet, PetType } from '@/app/types/model.types'

export const petInitialState: Pet = {
  id: '',
  name: '',
  type: '' as PetType,
  breed: '',
  age: '',
  gender: '',
  weight: '',
  ownerId: '',
  notes: '',

  appointments: [],
  medications: [],
  feedings: [],
  seizureActivities: [],
  walks: [],
  waterIntakes: [],
  bloodSugars: [],
  painScore: [],

  createdAt: new Date(),
  updatedAt: new Date()
}
