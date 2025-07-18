import { Camera, Clock, Phone, Shield } from 'lucide-react'

export const emergencySteps = [
  {
    icon: <Shield className="w-5 h-5 text-blue-500" />,
    title: 'Stay Calm',
    description: 'Keep yourself calm to help your pet effectively. Your energy affects them.'
  },
  {
    icon: <Clock className="w-5 h-5 text-orange-500" />,
    title: 'Time the Seizure',
    description: 'Start timing immediately. Seizures over 5 minutes require emergency care.'
  },
  {
    icon: <Camera className="w-5 h-5 text-purple-500" />,
    title: 'Record if Possible',
    description: 'Video helps veterinarians diagnose seizure type and severity.'
  },
  {
    icon: <Phone className="w-5 h-5 text-red-500" />,
    title: 'Call Vet if Needed',
    description: 'Contact emergency vet for seizures lasting 5+ minutes or multiple seizures.'
  }
]

export const safetyTips = [
  'Remove nearby objects that could cause injury',
  "Never put anything in your pet's mouth",
  "Don't restrain your pet during the seizure",
  'Gently cushion their head if possible'
]

export const seizureTypeOptions = [
  {
    value: 'GENERALIZED',
    label: 'Generalized',
    description: 'Grand mal, affects whole body',
    icon: '🧠',
    color: 'bg-red-50 border-red-300 text-red-700'
  },
  {
    value: 'FOCAL',
    label: 'Focal',
    description: 'Partial, affects specific area',
    icon: '🎯',
    color: 'bg-orange-50 border-orange-300 text-orange-700'
  },
  {
    value: 'ABSENCE',
    label: 'Absence',
    description: 'Brief loss of consciousness',
    icon: '😵',
    color: 'bg-yellow-50 border-yellow-300 text-yellow-700'
  },
  {
    value: 'MYOCLONIC',
    label: 'Myoclonic',
    description: 'Brief muscle jerks',
    icon: '⚡',
    color: 'bg-blue-50 border-blue-300 text-blue-700'
  },
  {
    value: 'TONIC_CLONIC',
    label: 'Tonic-Clonic',
    description: 'Stiffening then jerking',
    icon: '🌊',
    color: 'bg-purple-50 border-purple-300 text-purple-700'
  },
  {
    value: 'ATONIC',
    label: 'Atonic',
    description: 'Drop seizures',
    icon: '⬇️',
    color: 'bg-gray-50 border-gray-300 text-gray-700'
  },
  {
    value: 'UNKNOWN',
    label: 'Unknown',
    description: 'Type unclear',
    icon: '❓',
    color: 'bg-gray-50 border-gray-300 text-gray-700'
  }
]

export const severityOptions = [
  {
    value: 'MILD',
    label: 'Mild',
    description: 'Brief, minimal symptoms',
    color: 'bg-green-50 border-green-300 text-green-700',
    intensity: 1
  },
  {
    value: 'MODERATE',
    label: 'Moderate',
    description: 'Noticeable but controlled',
    color: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    intensity: 2
  },
  {
    value: 'SEVERE',
    label: 'Severe',
    description: 'Intense, long-lasting',
    color: 'bg-orange-50 border-orange-300 text-orange-700',
    intensity: 3
  },
  {
    value: 'CRITICAL',
    label: 'Critical',
    description: 'Emergency level',
    color: 'bg-red-50 border-red-300 text-red-700',
    intensity: 4
  }
]

export const commonTriggers = [
  'Loud noise',
  'Bright lights',
  'Stress',
  'Medication change',
  'Heat/excitement',
  'Sleep deprivation',
  'Food change',
  'Weather change',
  'Exercise',
  'Unknown',
  'None identified'
]

export enum SeizureSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}

export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const drawerVariants = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: {
    type: 'tween',
    duration: 0.3
  }
}
