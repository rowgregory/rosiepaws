import { Pet, PetType } from '@/app/types/entities'
import { initialUserState } from './user'

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
  owner: initialUserState,
  spayedNeutered: '',
  microchipId: '',
  allergies: '',
  fileName: '',
  filePath: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  lastVisit: new Date(),
  nextVisit: new Date(),

  painScores: [],
  feedings: [],
  vitalSigns: [],
  waters: [],
  movements: [],
  medications: [],
  appointments: [],
  bloodSugars: [],
  seizures: [],

  createdAt: new Date(),
  updatedAt: new Date()
}
