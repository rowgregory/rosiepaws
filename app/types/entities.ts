export type PetType = 'DOG' | 'CAT'

export enum AppointmentType {
  CHECKUP = 'CHECKUP',
  VACCINATION = 'VACCINATION',
  GROOMING = 'GROOMING',
  DENTAL = 'DENTAL',
  SURGERY = 'SURGERY',
  EMERGENCY = 'EMERGENCY',
  CONSULTATION = 'CONSULTATION'
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED'
}

export interface IStripeSubscription {
  id: string
  userId: string
  customerId: string
  paymentMethodId: string
  subscriptionId?: string
  status: string
  plan: string
  planPrice: number
  trialEndsAt?: Date
  cancelAtPeriodEnd: boolean
  canceledAt?: Date
  currentPeriodEnd?: Date
  createdAt: Date
  updatedAt: Date

  user: IUser
}

export interface IUser {
  id: string
  firstName?: string
  lastName?: string
  password?: string
  email: string
  isSuperUser: boolean
  isAdmin: boolean
  isGuardian: boolean
  isBasicUser: boolean
  isPremiumUser: boolean
  role: string
  securityQuestion?: string
  securityAnswerHash?: string

  name: string
  image: string
  emailVerified: any

  stripeCustomerId?: string
  stripeSubscription?: IStripeSubscription
  pets: Pet[]
  blogs: Blog[]

  createdAt: Date
  updatedAt: Date
}

export interface Pet {
  id: string
  name: string
  type: PetType
  breed: string
  age: string
  gender: string
  weight: string
  ownerId: string
  notes?: string
  owner: IUser
  spayedNeutered: string
  microchipId?: string
  allergies?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  lastVisit?: Date
  nextVisit?: Date

  // Related entities - you can type these more precisely if needed
  appointments: IAppointment[]
  medications: IMedication[]
  feedings: IFeeding[]
  seizures: ISeizure[]
  walks: IWalk[]
  waters: IWater[]
  bloodSugars: IBloodSugar[]
  painScores: PainScore[]
  movements: IMovement[]

  createdAt: Date
  updatedAt: Date
}

export interface IAppointment {
  id: string
  date: string
  time: string
  serviceType: AppointmentType
  description?: string
  status: AppointmentStatus
  veterinarian?: string
  notes?: string
  petId: string
  pet: Pet
  createdAt: Date
  updatedAt: Date
}

export interface IMedication {
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
  sentRemindersToday: string[]
  petId: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
}

export interface IFeeding {
  id: string
  timeRecorded: string
  foodType: string
  foodAmount: string
  moodRating: string
  brand: string
  ingredients?: string
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
}

export interface ISeizure {
  id: string
  timeRecorded: string
  duration: number // in seconds
  notes?: string
  petId: string
  videoUrl?: string
  videoFilename?: string
  seizureType: 'GENERALIZED' | 'FOCAL' | 'ABSENCE' | 'MYOCLONIC' | 'TONIC_CLONIC' | 'ATONIC' | 'UNKNOWN'
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
  triggerFactor?: string
  recoveryTime?: number
  videoFile?: File | null // for form handling before upload
  createdAt: Date
  updatedAt: Date

  pet: Pet
}

export interface Walk {
  id: string
  duration: number // in minutes
  timeRecorded: string
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date
}

export interface IWater {
  id: string
  intakeType: string
  milliliters: string
  timeRecorded: string
  moodRating: string
  notes?: string
  petId: string
  createdAt: Date
  updatedAt: Date

  pet: Pet
}

export interface IBloodSugar {
  id: string
  value: string
  notes?: string
  petId: string
  timeRecorded: string
  mealRelation?: 'FASTING' | 'BEFORE_MEAL' | 'AFTER_MEAL' | 'BEDTIME'
  measurementUnit?: 'MG_DL' | 'MMOL_L'
  targetRange?: string
  symptoms?: string
  medicationGiven?: boolean
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

export interface IWalk {
  id: string
  distance: string
  pace: string
  distraction: string
  duration: string
  moodRating: number
  timeRecorded: string
  movement?: string
  notes?: string
  petId: string
  pet?: Pet
  createdAt: Date
  updatedAt: Date
}

export interface IMovement {
  petId: string
  movementType: string
  durationMinutes: number
  distanceMeters: number
  activityLevel: string
  location: string
  indoor: boolean
  energyBefore: string
  energyAfter: string
  painBefore: number
  painAfter: number
  gaitQuality: string
  mobility: string
  assistance: string
  wheelchair: boolean
  harness: boolean
  leash: boolean
  enthusiasm: number
  reluctance: boolean
  limping: boolean
  panting: string
  restBreaks: number
  recoveryTime: number
  notes: string
  timeRecorded: string

  pet: Pet
}
