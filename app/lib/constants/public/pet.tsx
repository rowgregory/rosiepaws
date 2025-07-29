import { PawPrint, Shield, Stethoscope, Calendar, Sparkles, Clock, Award, Activity } from 'lucide-react'

export const PET_TYPES = [
  { id: 'dog', name: 'Dog', icon: '🐶', color: 'bg-amber-50 border-amber-300 text-amber-700' },
  { id: 'cat', name: 'Cat', icon: '🐱', color: 'bg-purple-50 border-purple-300 text-purple-700' }
]

export const GENDER_OPTIONS = [
  { id: 'male', name: 'Male', icon: '♂️', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { id: 'female', name: 'Female', icon: '♀️', color: 'bg-pink-50 border-pink-300 text-pink-700' }
]

export const POPULAR_BREEDS = {
  dog: [
    'Golden Retriever',
    'Labrador',
    'German Shepherd',
    'Bulldog',
    'Beagle',
    'Poodle',
    'Rottweiler',
    'Siberian Husky'
  ],
  cat: ['Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal', 'Abyssinian', 'Russian Blue', 'Siamese']
}

export const SPAY_NEUTER_OPTIONS = [
  { id: 'YES', name: 'Yes', color: 'bg-green-50 border-green-500 text-green-700' },
  { id: 'NO', name: 'No', color: 'bg-gray-50 border-gray-500 text-gray-700' },
  { id: 'UNKNOWN', name: 'Unknown', color: 'bg-yellow-50 border-yellow-500 text-yellow-700' }
]

export const PET_TIPS = [
  {
    icon: <PawPrint className="w-5 h-5 text-indigo-500" />,
    title: 'Name & Breed Precision',
    description:
      'Use their full name and specific breed for AI-powered health insights and breed-specific care recommendations.',
    badge: 'Essential',
    color: 'bg-indigo-50 border-indigo-200'
  },
  {
    icon: <Calendar className="w-5 h-5 text-emerald-500" />,
    title: 'Age Accuracy',
    description:
      'Include months for young pets under 2 years. Precise age enables personalized vaccination schedules and growth tracking.',
    badge: 'Important',
    color: 'bg-emerald-50 border-emerald-200'
  },
  {
    icon: <Stethoscope className="w-5 h-5 text-rose-500" />,
    title: 'Weight Monitoring',
    description: 'Regular weight updates help our AI detect health patterns and provide early intervention alerts.',
    badge: 'Health',
    color: 'bg-rose-50 border-rose-200'
  },
  {
    icon: <Shield className="w-5 h-5 text-violet-500" />,
    title: 'Medical History',
    description: 'Complete medical records, allergies, and emergency contacts ensure comprehensive care coordination.',
    badge: 'Critical',
    color: 'bg-violet-50 border-violet-200'
  }
]

export const BREED_CATEGORIES = [
  {
    type: '🐶',
    label: 'Popular Dog Breeds',
    breeds: ['Golden Retriever', 'Labrador', 'German Shepherd', 'French Bulldog', 'Poodle', 'Beagle'],
    color: 'from-blue-400 to-indigo-500'
  },
  {
    type: '🐱',
    label: 'Popular Cat Breeds',
    breeds: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal'],
    color: 'from-purple-400 to-pink-500'
  }
]

export const PET_STATS = [
  {
    icon: <Activity className="w-5 h-5 text-blue-500" />,
    value: '24/7',
    label: 'Health Monitoring',
    description: 'Continuous AI-powered health tracking'
  },
  {
    icon: <Award className="w-5 h-5 text-emerald-500" />,
    value: '95%',
    label: 'Care Accuracy',
    description: 'Veterinarian-approved recommendations'
  },
  {
    icon: <Clock className="w-5 h-5 text-orange-500" />,
    value: '< 1min',
    label: 'Setup Time',
    description: 'Quick and easy profile creation'
  },
  {
    icon: <Sparkles className="w-5 h-5 text-violet-500" />,
    value: '500+',
    label: 'Care Insights',
    description: 'Personalized health recommendations'
  }
]
