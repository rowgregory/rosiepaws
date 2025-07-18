import { Pet, PetType } from '@/app/types/entities'

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
  owner: {
    id: '',
    name: '',
    email: '',
    isSuperUser: false,
    isAdmin: false,
    isGuardian: false,
    isBasicUser: false,
    isPremiumUser: false,
    role: '',
    image: '',
    emailVerified: undefined,
    pets: [],
    blogs: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  spayedNeutered: '',
  microchipId: '',
  allergies: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  lastVisit: new Date(),
  nextVisit: new Date(),

  appointments: [],
  medications: [],
  feedings: [],
  seizures: [],
  walks: [],
  waters: [],
  bloodSugars: [],
  painScores: [],
  movements: [],

  createdAt: new Date(),
  updatedAt: new Date()
}
