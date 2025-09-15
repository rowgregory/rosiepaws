import { Thermometer, Heart, Activity, Weight, Eye, Droplets, Clock } from 'lucide-react'

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

export const vitalSignsGuide = [
  {
    id: 'temperature',
    icon: Thermometer,
    title: 'Temperature',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    normalRange: {
      dog: '101-102.5°F',
      cat: '100.5-102.5°F'
    },
    howTo: [
      'Use a digital rectal thermometer (most accurate)',
      'Lubricate thermometer with petroleum jelly',
      'Insert about 1 inch into rectum',
      'Hold for 1-2 minutes until it beeps',
      'Alternative: Use ear thermometer designed for pets'
    ],
    whenToConcern: ['Below 99°F or above 104°F', 'Lethargy with fever', 'Shivering or panting excessively'],
    tips: [
      'Take temperature when pet is calm',
      'Have someone help hold your pet',
      'Clean thermometer before and after use'
    ]
  },
  {
    id: 'heartRate',
    icon: Heart,
    title: 'Heart Rate',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    normalRange: {
      dog: '70-120 bpm',
      cat: '140-220 bpm'
    },
    howTo: [
      'Place hand on left side of chest behind front leg',
      'Feel for heartbeat or pulse',
      'Count beats for 15 seconds, multiply by 4',
      'Alternative: Feel pulse on inside of back leg',
      'Use a stethoscope if available'
    ],
    whenToConcern: [
      'Very slow (<60 bpm) or very fast (>160 bpm for dogs, >240 for cats)',
      'Irregular rhythm',
      'Weak or difficult to find pulse'
    ],
    tips: [
      'Practice when your pet is healthy',
      'Count during rest, not after exercise',
      'Small dogs naturally have faster heart rates'
    ]
  },
  {
    id: 'respiratory',
    icon: Activity,
    title: 'Respiratory Rate',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    normalRange: {
      dog: '10-30 breaths/min',
      cat: '20-30 breaths/min'
    },
    howTo: [
      'Watch chest rise and fall while pet is resting',
      'Count breaths for 15 seconds, multiply by 4',
      'One breath = one inhale + one exhale',
      'Observe from a distance to avoid exciting pet',
      'Count when pet is lying down and calm'
    ],
    whenToConcern: [
      'Rapid breathing at rest (>40 breaths/min)',
      'Labored or difficult breathing',
      'Blue gums or tongue',
      'Open-mouth breathing in cats'
    ],
    tips: [
      'Best measured when pet is sleeping',
      'Avoid counting right after exercise',
      'Panting is not normal breathing'
    ]
  },
  {
    id: 'weight',
    icon: Weight,
    title: 'Weight',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    normalRange: {
      dog: 'Varies by breed',
      cat: '8-12 lbs average'
    },
    howTo: [
      'Use bathroom scale for large dogs',
      'For small pets: weigh yourself, then holding pet',
      'Subtract your weight from combined weight',
      'Use pet scale if available',
      'Weigh at same time of day for consistency'
    ],
    whenToConcern: [
      'Sudden weight loss (>10% in short time)',
      'Gradual weight loss without diet changes',
      'Rapid weight gain'
    ],
    tips: ['Keep a weight log', 'Weigh weekly for sick pets', 'Monthly weighing for healthy pets']
  },
  {
    id: 'mucousMembranes',
    icon: Eye,
    title: 'Gum Color',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    normalRange: {
      dog: 'Pink and moist',
      cat: 'Pink and moist'
    },
    howTo: [
      'Gently lift upper lip to expose gums',
      'Check color above canine teeth',
      'Normal: pink like bubble gum',
      'Should feel moist, not sticky',
      'Check in good lighting'
    ],
    whenToConcern: [
      'White or very pale gums',
      'Blue or purple gums (emergency!)',
      'Yellow gums',
      'Bright red gums',
      'Dry or sticky gums'
    ],
    tips: [
      'Compare to normal when pet is healthy',
      'Some pets have naturally dark gums',
      'Check inner eyelids if gums are dark'
    ]
  },
  {
    id: 'hydration',
    icon: Droplets,
    title: 'Hydration',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    normalRange: {
      dog: 'Skin snaps back quickly',
      cat: 'Skin snaps back quickly'
    },
    howTo: [
      'Gently pinch skin on back of neck',
      'Lift skin up and release',
      'Normal: skin returns immediately',
      'Dehydrated: skin stays "tented" for seconds',
      'Test on scruff area between shoulder blades'
    ],
    whenToConcern: [
      'Skin takes >2 seconds to return',
      'Skin stays tented',
      'Dry gums along with slow skin return',
      'Sunken eyes'
    ],
    tips: [
      'Practice the test when pet is healthy',
      'Older pets may have naturally slower return',
      'Check gums too - should be moist'
    ]
  },
  {
    id: 'capillaryRefill',
    icon: Clock,
    title: 'Capillary Refill',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    normalRange: {
      dog: '<2 seconds',
      cat: '<2 seconds'
    },
    howTo: [
      'Press firmly on gum with finger',
      'Release pressure quickly',
      'Watch for color to return to pink',
      'Time how long it takes',
      'Normal: color returns in 1-2 seconds'
    ],
    whenToConcern: ['Takes longer than 2-3 seconds', 'No color return', 'Gums stay white after pressure'],
    tips: ['Use good lighting', 'Press on upper gum above canine tooth', 'Practice when pet is healthy to know normal']
  }
]
