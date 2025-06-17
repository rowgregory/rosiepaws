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
  waters: Water[]
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
  drugName: string
  dosage: string
  dosageUnit: string
  frequency: string
  customFrequency?: string
  startDate: string
  endDate?: string
  reminderEnabled: boolean
  reminderTimes: string[]
  instructions?: string
  prescribedBy?: string
  petId: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
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

export interface Water {
  id: string
  intakeType: string
  milliliters: string
  relativeIntake: string
  timeRecorded: string
  moodRating: string
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
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
  timeRecorded: string
  notes?: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
}
