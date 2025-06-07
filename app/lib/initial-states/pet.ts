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
  seizures: [],
  walks: [],
  waterIntakes: [],
  bloodSugars: [],
  painScores: [],

  createdAt: new Date(),
  updatedAt: new Date()
}
