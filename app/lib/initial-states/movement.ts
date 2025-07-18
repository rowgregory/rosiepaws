import { IMovement } from '@/app/types'
import { petInitialState } from './pet'

export const movementInitialState: IMovement = {
  // Basic Info
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

  pet: petInitialState
}
