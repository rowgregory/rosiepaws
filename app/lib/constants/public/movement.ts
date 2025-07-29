import { Activity, AlertTriangle, Clock, Eye, Heart, Info } from 'lucide-react'

export const MOVEMENT_TYPES = [
  { value: 'WALK', label: 'Walk', icon: '🚶', description: 'Regular walking exercise' },
  { value: 'RUN', label: 'Run', icon: '🏃', description: 'Running or jogging activity' },
  { value: 'SWIM', label: 'Swim', icon: '🏊', description: 'Swimming exercise' },
  { value: 'PHYSICAL_THERAPY', label: 'Physical Therapy', icon: '🏥', description: 'Therapeutic movement' },
  { value: 'INDOOR_ACTIVITY', label: 'Indoor Activity', icon: '🏠', description: 'Indoor movement and play' },
  { value: 'YARD_TIME', label: 'Yard Time', icon: '🌿', description: 'Free movement in yard' },
  { value: 'WHEELCHAIR_MOBILITY', label: 'Wheelchair', icon: '♿', description: 'Wheelchair-assisted movement' },
  { value: 'ASSISTED_WALKING', label: 'Assisted Walking', icon: '🤝', description: 'Walking with assistance' }
]

export const ACTIVITY_LEVELS = [
  { value: 'VERY_LOW', label: 'Very Low', color: 'bg-gray-500', borderColor: 'border-gray-500', bgColor: 'bg-gray-50' },
  { value: 'LOW', label: 'Low', color: 'bg-blue-500', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
  {
    value: 'MODERATE',
    label: 'Moderate',
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  { value: 'HIGH', label: 'High', color: 'bg-orange-500', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
  { value: 'VERY_HIGH', label: 'Very High', color: 'bg-red-500', borderColor: 'border-red-500', bgColor: 'bg-red-50' }
]

export const ENERGY_LEVELS = [
  { value: 'EXHAUSTED', label: 'Exhausted', color: 'bg-red-600' },
  { value: 'TIRED', label: 'Tired', color: 'bg-orange-500' },
  { value: 'NORMAL', label: 'Normal', color: 'bg-green-500' },
  { value: 'ENERGETIC', label: 'Energetic', color: 'bg-blue-500' },
  { value: 'HYPERACTIVE', label: 'Hyperactive', color: 'bg-purple-500' }
]

export const GAIT_QUALITIES = [
  { value: 'NORMAL', label: 'Normal', description: 'Regular, balanced movement' },
  { value: 'SLIGHTLY_OFF', label: 'Slightly Off', description: 'Minor irregularities in movement' },
  { value: 'NOTICEABLE_LIMP', label: 'Noticeable Limp', description: 'Obvious favoring of one limb' },
  { value: 'SEVERE_LIMP', label: 'Severe Limp', description: 'Significant mobility impairment' },
  { value: 'UNABLE_TO_WALK', label: 'Unable to Walk', description: 'Cannot walk independently' }
]

export const MOBILITY_LEVELS = [
  { value: 'FULL_MOBILITY', label: 'Full Mobility' },
  { value: 'SLIGHT_LIMITATION', label: 'Slight Limitation' },
  { value: 'MODERATE_LIMITATION', label: 'Moderate Limitation' },
  { value: 'SEVERE_LIMITATION', label: 'Severe Limitation' },
  { value: 'IMMOBILE', label: 'Immobile' }
]

export const ASSISTANCE_TYPES = [
  { value: 'NONE', label: 'None' },
  { value: 'VERBAL_ENCOURAGEMENT', label: 'Verbal Encouragement' },
  { value: 'LEASH_SUPPORT', label: 'Leash Support' },
  { value: 'HARNESS_LIFT', label: 'Harness Lift' },
  { value: 'WHEELCHAIR', label: 'Wheelchair' },
  { value: 'CARRIED', label: 'Carried' },
  { value: 'FULL_ASSISTANCE', label: 'Full Assistance' }
]

export const PANTING_LEVELS = [
  { value: 'NONE', label: 'None' },
  { value: 'LIGHT', label: 'Light' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'HEAVY', label: 'Heavy' },
  { value: 'EXCESSIVE', label: 'Excessive' }
]

export const sections = [
  {
    id: 'basics',
    title: 'Assessment Basics',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    content: [
      {
        subtitle: 'Before You Start',
        items: [
          'Observe your pet in a calm, familiar environment',
          'Have treats ready for encouragement',
          'Note time of day and weather conditions',
          'Ensure safety equipment is available if needed'
        ]
      },
      {
        subtitle: 'Documentation Tips',
        items: [
          'Record immediately after movement session',
          'Be specific about observations',
          'Note any changes from previous sessions',
          'Include both positive and concerning signs'
        ]
      }
    ]
  },
  {
    id: 'activity',
    title: 'Activity Level Guide',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    content: [
      {
        subtitle: 'Activity Levels',
        items: [
          'Very Low: Minimal movement, reluctant to move',
          'Low: Slow, careful movements with encouragement',
          'Moderate: Normal pace with some enthusiasm',
          'High: Eager movement, good energy throughout',
          'Very High: Excited, energetic, may need calming'
        ]
      },
      {
        subtitle: 'Consider These Factors',
        items: [
          'Time since last medication',
          'Weather and temperature',
          "Pet's mood and comfort level",
          'Any recent health changes'
        ]
      }
    ]
  },
  {
    id: 'gait',
    title: 'Gait & Mobility',
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    content: [
      {
        subtitle: 'Gait Quality Assessment',
        items: [
          'Normal: Even, balanced steps with good coordination',
          'Slightly Off: Minor irregularities, occasional stumble',
          'Noticeable Limp: Clear favoring of one limb',
          'Severe Limp: Significant difficulty bearing weight',
          'Unable to Walk: Cannot support weight independently'
        ]
      },
      {
        subtitle: 'What to Watch For',
        items: [
          'Head bobbing or tilting during movement',
          'Shortened stride length',
          'Reluctance to turn or change direction',
          'Difficulty with stairs or uneven surfaces',
          'Trembling or shaking while moving'
        ]
      }
    ]
  },
  {
    id: 'pain',
    title: 'Pain Assessment',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    content: [
      {
        subtitle: 'Pain Scale (0-10)',
        items: [
          '0-1: No visible signs of discomfort',
          '2-3: Mild discomfort, slightly cautious movement',
          '4-5: Moderate pain, clear behavioral changes',
          '6-7: Significant pain, reluctant to move',
          '8-10: Severe pain, distressed vocalizations'
        ]
      },
      {
        subtitle: 'Pain Indicators',
        items: [
          'Panting when not hot or after minimal exertion',
          'Reluctance to start or continue movement',
          'Whimpering or other vocalizations',
          'Seeking comfort or hiding behavior',
          'Changes in posture or weight distribution'
        ]
      }
    ]
  },
  {
    id: 'energy',
    title: 'Energy Levels',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    content: [
      {
        subtitle: 'Energy Assessment',
        items: [
          'Exhausted: Lying down, heavy breathing, no interest',
          'Tired: Slower movements, needs encouragement',
          "Normal: Typical energy for your pet's condition",
          'Energetic: Alert, willing participant, good stamina',
          'Hyperactive: Overly excited, may need calming'
        ]
      },
      {
        subtitle: 'Energy Changes',
        items: [
          'Compare energy before and after movement',
          'Note if movement improves or depletes energy',
          'Consider time since meals and medications',
          'Factor in sleep quality and daily routine'
        ]
      }
    ]
  },
  {
    id: 'safety',
    title: 'Safety & Red Flags',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    content: [
      {
        subtitle: 'Stop Movement If You See',
        items: [
          'Excessive panting or difficulty breathing',
          'Collapse or inability to support weight',
          'Signs of severe pain or distress',
          'Disorientation or loss of balance',
          'Vomiting or loss of bladder control'
        ]
      },
      {
        subtitle: 'Contact Vet Immediately',
        items: [
          'Sudden onset of severe symptoms',
          'Significant worsening of mobility',
          'Signs of seizure activity',
          'Extreme lethargy or unresponsiveness',
          'Any behavior that seems abnormal for your pet'
        ]
      }
    ]
  }
]
