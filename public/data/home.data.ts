import { Crown, Gift, Sparkles } from 'lucide-react'

export const plans = [
  {
    id: 'free',
    name: 'Free',
    role: 'free_user',
    subtitle: 'Basic pet care tracking to get started',
    price: '$0',
    period: '/month',
    features: [
      '250 daily tokens (1-2 actions per day)',
      'Single pet profile only',
      'Pain scoring, feeding & water tracking only',
      'No advanced features or insights',
      'Email support only',
      'Cannot track medications, vitals, or medical data'
    ],
    color: 'from-gray-400 to-gray-500',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    popular: false,
    icon: Gift
  },
  {
    id: 'comfort',
    name: 'Comfort',
    role: 'comfort_user',
    subtitle: 'Complete pet health management for dedicated pet parents',
    price: '$10',
    period: '/month',
    features: [
      '12,000 monthly tokens - 67x more than free!',
      'ALL standard features unlocked',
      'Up to 3 pet profiles',
      'Vital signs & movement tracking',
      'Medication management & reminders',
      'Photo & video galleries',
      '1 support ticket per week'
    ],
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    popular: true,
    icon: Sparkles,
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 'legacy',
    name: 'Legacy',
    role: 'legacy_user',
    subtitle: 'Unlimited pet care for families with multiple pets or medical needs',
    price: '$25',
    period: '/month',
    features: [
      'UNLIMITED tokens - never worry about limits',
      'Unlimited pet profiles',
      'Blood sugar monitoring & seizure tracking',
      'Appointment tracking & medical records',
      'Advanced movement & behavior monitoring',
      'Premium data export & resources',
      'Unlimited support tickets',
      'Perfect for diabetic, epileptic, or special needs pets'
    ],
    color: 'from-purple-500 to-indigo-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    popular: false,
    icon: Crown,
    gradient: 'from-purple-600 to-pink-600'
  }
]
