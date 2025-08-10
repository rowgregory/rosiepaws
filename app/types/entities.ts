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
  subscriptionId: string | null
  status: string
  plan: string
  planPrice: number
  tokensIncluded: number
  trialEndsAt: Date | null
  cancelAtPeriodEnd: boolean
  canceledAt: Date | null
  currentPeriodEnd: Date | null
  paymentMethod: string | null
  paymentMethodBrand: string | null
  paymentMethodLast4: string | null
  createdAt: Date
  updatedAt: Date

  user: IUser
}

export interface IUser {
  id: string
  email: string
  role: string
  isSuperUser: boolean
  isAdmin: boolean
  isFreeUser: boolean
  isComfortUser: boolean
  isLegacyUser: boolean
  firstName?: string
  lastName?: string

  stripeCustomerId?: string

  // NextAuth fields
  emailVerified?: Date | null
  name?: string
  image?: string

  // Token fields
  tokens: number
  tokensUsed: number
  lastTokenReset?: Date | null

  // Relationships
  accounts: any[]
  sessions: any[]
  pets: any[]
  stripeSubscription?: any
  tokenTransactions: any[]
  galleryItems: any[]
  tickets: any[]

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
  vitalSigns: IVitalSigns[]
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
  isCareTask?: boolean
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
  isCareTask?: boolean
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
  isCareTask?: boolean
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
  isCareTask?: boolean
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
  tempId: string

  pet: Pet
}

export interface IMovement {
  id: any
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
  createdAt: Date | string
  updatedAt: Date | string

  pet: Pet
}

export interface ITicketAttachment {
  id?: string
  url: string
  filename: string
  size?: number
  type?: string
  uploadedAt?: string
}

export interface ITicket {
  messages: any
  status: any
  id: string
  category: 'bug' | 'feature' | 'support' | 'billing' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject: string
  description: string
  email: string
  deviceInfo?: string | null // JSON string in DB
  attachments?: ITicketAttachment[] | null // JSON in DB
  user: IUser
  userId: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

// Union type for all possible metadata
export type LogMetadata = Record<string, any>

export interface ILog {
  id: string
  level: LogLevel // 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata?: LogMetadata | null
  createdAt: Date | string
}

export enum MediaType {
  POSTER = 'POSTER',
  EBOOK = 'EBOOK',
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export enum MediaColor {
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  GREEN = 'GREEN',
  ORANGE = 'ORANGE',
  RED = 'RED',
  INDIGO = 'INDIGO',
  PINK = 'PINK',
  YELLOW = 'YELLOW',
  GRAY = 'GRAY'
}

export interface IMedia {
  id: string
  title: string
  type: MediaType
  format: string
  size: string // Human readable size like "2.4 MB"
  sizeBytes?: string // Actual file size in bytes (as string for BigInt compatibility)
  uploadDate: string // ISO date string
  views: number
  downloads: number
  thumbnail?: string // URL or base64 encoded thumbnail
  color: MediaColor

  // File storage information
  fileName: string // Original filename
  filePath: string // Storage path or Firebase URL
  mimeType: string // MIME type like "application/pdf"

  // Metadata
  description?: string
  tags: string[] // Array of tags for organization
  isActive: boolean

  // Audit fields
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  deletedAt?: string // ISO date string for soft delete
}

export type CapillaryRefillTime =
  | 'LESS_THAN_ONE_SECOND'
  | 'ONE_TO_TWO_SECONDS'
  | 'TWO_TO_THREE_SECONDS'
  | 'MORE_THAN_THREE_SECONDS'

export type MucousMembraneColor =
  | 'PINK_AND_MOIST'
  | 'PALE'
  | 'WHITE'
  | 'BLUE_CYANOTIC'
  | 'YELLOW_ICTERIC'
  | 'RED_INJECTED'

export type HydrationStatus = 'NORMAL' | 'MILD_DEHYDRATION' | 'MODERATE_DEHYDRATION' | 'SEVERE_DEHYDRATION'

export interface IVitalSigns {
  id: string
  createdAt: Date
  updatedAt: Date

  // Pet Information
  petId: string

  // Basic Vital Signs
  temperature?: number | null // Fahrenheit
  heartRate?: number | null // beats per minute
  respiratoryRate?: number | null // breaths per minute
  weight?: number | null // pounds
  bloodPressure?: string | null // systolic/diastolic format

  // Physical Assessment
  capillaryRefillTime?: CapillaryRefillTime | string
  mucousMembranes?: MucousMembraneColor | string
  hydrationStatus?: HydrationStatus | string

  // Additional Information
  timeRecorded: string
  notes?: string | null

  pet: Pet
}
