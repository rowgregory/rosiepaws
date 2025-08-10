import { IMovement } from '@/app/types'
import { petInitialState } from './pet'

export const movementInitialState: IMovement = {
  // Basic Info
  id: '',
  petId: '',
  timeRecorded: '',

  // Movement Details
  movementType: 'WALK',
  durationMinutes: 10,
  distanceMeters: 600,
  activityLevel: 'MODERATE',

  // Location & Environment
  location: 'Outside',
  indoor: false,

  // Energy Assessment
  energyBefore: 'NORMAL',
  energyAfter: 'NORMAL',

  // Pain Assessment
  painBefore: 0,
  painAfter: 0,

  // Movement Quality
  gaitQuality: 'NORMAL',
  mobility: 'FULL_MOBILITY',
  assistance: '',

  // Equipment Used
  wheelchair: false,
  harness: false,
  leash: false,

  // Behavioral Observations
  enthusiasm: 0,
  reluctance: false,
  limping: false,
  panting: 'MODERATE',

  // Rest & Recovery
  restBreaks: 0,
  recoveryTime: 0,

  // Additional Notes
  notes: '',

  pet: petInitialState,

  createdAt: new Date(),
  updatedAt: new Date()
}

export const movementInitialErrorState: IMovement = {
  // Basic Info
  id: '',
  petId: '',
  timeRecorded: '',

  // Movement Details
  movementType: '',
  durationMinutes: 0,
  distanceMeters: 0,
  activityLevel: '',

  // Location & Environment
  location: '',
  indoor: false,

  // Energy Assessment
  energyBefore: '',
  energyAfter: '',

  // Pain Assessment
  painBefore: 0,
  painAfter: 0,

  // Movement Quality
  gaitQuality: '',
  mobility: '',
  assistance: '',

  // Equipment Used
  wheelchair: false,
  harness: false,
  leash: false,

  // Behavioral Observations
  enthusiasm: 0,
  reluctance: false,
  limping: false,
  panting: '',

  // Rest & Recovery
  restBreaks: 0,
  recoveryTime: 0,

  // Additional Notes
  notes: '',

  pet: petInitialState,

  createdAt: new Date(),
  updatedAt: new Date()
}
