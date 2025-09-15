import { Activity, AlertTriangle, Clock, Eye, Heart, TrendingDown, TrendingUp } from 'lucide-react'

export const BLOOD_SUGAR_RANGES = [
  {
    min: 0,
    max: 49,
    label: 'Critically Low (<50)',
    color: 'bg-red-100 border-red-400 text-red-800',
    emoji: '🚨'
  },
  {
    min: 50,
    max: 79,
    label: 'Low (50-79)',
    color: 'bg-red-50 border-red-300 text-red-700',
    emoji: '⬇️'
  },
  {
    min: 80,
    max: 150,
    label: 'Normal (80-150)',
    color: 'bg-green-50 border-green-300 text-green-700',
    emoji: '✅'
  },
  {
    min: 151,
    max: 200,
    label: 'Elevated (151-200)',
    color: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    emoji: '⚠️'
  },
  {
    min: 201,
    max: 300,
    label: 'High (201-300)',
    color: 'bg-orange-50 border-orange-300 text-orange-700',
    emoji: '⬆️'
  },
  {
    min: 301,
    max: 999,
    label: 'Very High (300+)',
    color: 'bg-red-100 border-red-400 text-red-800',
    emoji: '🚨'
  }
]

export const normalRanges = [
  {
    pet: 'Dogs',
    normal: '80-120 mg/dL',
    fasting: '70-100 mg/dL',
    color: 'text-blue-600'
  },
  {
    pet: 'Cats',
    normal: '80-120 mg/dL',
    fasting: '70-100 mg/dL',
    color: 'text-purple-600'
  }
]

export const warningLevels = [
  {
    level: 'Critically Low',
    range: 'Below 50 mg/dL',
    severity: 'critical',
    icon: AlertTriangle,
    color: 'text-red-800 bg-red-100 border-red-400',
    action: 'Emergency - Contact vet immediately'
  },
  {
    level: 'Low (Hypoglycemia)',
    range: '50-79 mg/dL',
    severity: 'critical',
    icon: TrendingDown,
    color: 'text-red-700 bg-red-50 border-red-300',
    action: 'Monitor closely, contact vet if symptoms occur'
  },
  {
    level: 'Elevated',
    range: '151-200 mg/dL',
    severity: 'warning',
    icon: TrendingUp,
    color: 'text-yellow-700 bg-yellow-50 border-yellow-300',
    action: 'Monitor diet and medication timing'
  },
  {
    level: 'High (Hyperglycemia)',
    range: '201-300 mg/dL',
    severity: 'high',
    icon: AlertTriangle,
    color: 'text-orange-700 bg-orange-50 border-orange-300',
    action: 'Veterinary consultation recommended'
  },
  {
    level: 'Very High',
    range: 'Above 300 mg/dL',
    severity: 'critical',
    icon: AlertTriangle,
    color: 'text-red-800 bg-red-100 border-red-400',
    action: 'Urgent veterinary attention needed'
  }
]

export const symptoms = {
  low: [
    'Weakness or lethargy',
    'Trembling or shaking',
    'Confusion or disorientation',
    'Loss of coordination',
    'Seizures (severe cases)'
  ],
  high: ['Increased thirst', 'Frequent urination', 'Increased appetite', 'Weight loss', 'Vomiting or nausea']
}

export const bloodSugarTips = [
  {
    icon: Clock,
    title: 'Timing Matters',
    description: 'Test 2-4 hours after meals for most accurate readings'
  },
  {
    icon: Heart,
    title: 'Stress-Free Testing',
    description: 'Keep your pet calm during testing for reliable results'
  },
  {
    icon: Activity,
    title: 'Exercise Impact',
    description: 'Physical activity can lower blood sugar levels'
  },
  {
    icon: Eye,
    title: 'Watch for Patterns',
    description: 'Track readings over time to identify trends'
  }
]

export const mealRelationOptions = [
  { value: 'FASTING', label: 'Fasting (8+ hours)', icon: '🌅' },
  { value: 'BEFORE_MEAL', label: 'Before Meal', icon: '🍽️' },
  { value: 'AFTER_MEAL', label: 'After Meal (1-2hrs)', icon: '🍴' },
  { value: 'BEDTIME', label: 'Bedtime', icon: '🌙' },
  { value: 'RANDOM', label: 'Random Time', icon: '🔄' }
]

export const measurementUnitOptions = [
  { value: 'MG_DL', label: 'mg/dL (US)', description: 'Milligrams per deciliter' },
  { value: 'MMOL_L', label: 'mmol/L (International)', description: 'Millimoles per liter' }
]

export const symptomsOptions = [
  'Excessive thirst',
  'Frequent urination',
  'Lethargy',
  'Loss of appetite',
  'Vomiting',
  'Weight loss',
  'Weakness',
  'Sweet breath odor',
  'None observed'
]
