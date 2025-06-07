export type PetType = 'DOG' | 'CAT'

export interface Pet {
  id: string
  name: string
  type: PetType
  breed?: string
  age?: string
  gender?: string
  weight?: string
  ownerId: string
  notes?: string

  // Related entities - you can type these more precisely if needed
  appointments: Appointment[]
  medications: Medication[]
  feedings: IFeeding[]
  seizures: ISeizure[]
  walks: Walk[]
  waterIntakes: WaterIntake[]
  bloodSugars: BloodSugar[]
  painScores: PainScore[]

  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  date: Date
  reason: string
  location?: string
  notes?: string
  petId: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  timeGiven: Date
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date
}

export interface IFeeding {
  id: string
  timeFed: Date | string
  foodType: string
  foodAmount: string
  moodRating: string
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
}

export interface ISeizure {
  id: string
  occurredAt: Date
  duration?: number // in seconds
  notes?: string
  petId: string
  videoUrl?: string
  videoFilename?: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
}

export interface Walk {
  id: string
  duration: number // in minutes
  timeWalked: Date
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date
}

export interface WaterIntake {
  id: string
  amount: number // in mL or oz
  timeGiven: Date
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date
}

export interface BloodSugar {
  id: string
  value: string
  notes?: string
  petId: string
  timeTaken: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
}

export interface Blog {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface PainScore {
  id: string
  petId: string
  score: number // Should be constrained between 1 and 5
  createdAt: Date
  updatedAt: Date

  pet: Pet
}
