export const NORMAL_RANGES = {
  DOG: {
    temperature: { min: 101.0, max: 102.5, unit: '°F' },
    heartRate: { min: 70, max: 120, unit: 'bpm' },
    respiratoryRate: { min: 10, max: 30, unit: 'breaths/min' }
  },
  CAT: {
    temperature: { min: 100.5, max: 102.5, unit: '°F' },
    heartRate: { min: 140, max: 220, unit: 'bpm' },
    respiratoryRate: { min: 20, max: 30, unit: 'breaths/min' }
  }
} as const

// Enum value mappings for display
export const CAPILLARY_REFILL_TIME_LABELS = {
  LESS_THAN_ONE_SECOND: '<1 second (Normal)',
  ONE_TO_TWO_SECONDS: '1-2 seconds (Normal)',
  TWO_TO_THREE_SECONDS: '2-3 seconds (Mild dehydration)',
  MORE_THAN_THREE_SECONDS: '>3 seconds (Concerning)'
} as const

export const MUCOUS_MEMBRANE_LABELS = {
  PINK_AND_MOIST: 'Pink and moist (Normal)',
  PALE: 'Pale',
  WHITE: 'White',
  BLUE_CYANOTIC: 'Blue/Cyanotic',
  YELLOW_ICTERIC: 'Yellow/Icteric',
  RED_INJECTED: 'Red/Injected'
} as const

export const HYDRATION_STATUS_LABELS = {
  NORMAL: 'Normal',
  MILD_DEHYDRATION: 'Mild dehydration (3-5%)',
  MODERATE_DEHYDRATION: 'Moderate dehydration (5-10%)',
  SEVERE_DEHYDRATION: 'Severe dehydration (>10%)'
} as const

export const PET_TYPE_LABELS = {
  DOG: 'Dog',
  CAT: 'Cat'
} as const
