import { Heart, Play, MapPin, Calendar, HelpCircle, UtensilsCrossed, AlertTriangle, Droplet } from 'lucide-react'
import {
  appointmentCreateTokenCost,
  appointmentDeleteTokenCost,
  appointmentUpdateTokenCost,
  feedingCreateTokenCost,
  feedingDeleteTokenCost,
  feedingUpdateTokenCost,
  freeTierDailyTokens,
  movementCreateTokenCost,
  movementDeleteTokenCost,
  movementUpdateTokenCost,
  painScoreCreateTokenCost,
  painScoreDeleteTokenCost,
  painScoreUpdateTokenCost,
  petCreateTokenCost,
  petDeleteTokenCost,
  petUpdateTokenCost,
  vitalSignsCreateTokenCost,
  vitalSignsDeleteTokenCost,
  vitalSignsUpdateTokenCost,
  waterCreateTokenCost,
  waterDeleteTokenCost,
  waterUpdateTokenCost
} from './token'

export const tabs = [
  { id: 'actions', label: 'Token Actions', icon: <Play className="w-3 h-3 lg:w-4 lg:h-4" /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-3 h-3 lg:w-4 lg:h-4" /> }
]

export const tokenActions = [
  {
    name: 'Pet Profile',
    icon: Heart,
    createCost: petCreateTokenCost,
    editCost: petUpdateTokenCost,
    deleteCost: petDeleteTokenCost,
    description: "Create and manage your pet's basic profile information"
  },
  {
    name: 'Pain Score',
    icon: AlertTriangle,
    createCost: painScoreCreateTokenCost,
    editCost: painScoreUpdateTokenCost,
    deleteCost: painScoreDeleteTokenCost,
    description: 'Log pain levels for comfort monitoring - essential for daily care'
  },
  {
    name: 'Feeding',
    icon: UtensilsCrossed,
    createCost: feedingCreateTokenCost,
    editCost: feedingUpdateTokenCost,
    deleteCost: feedingDeleteTokenCost,
    description: 'Track feeding times and amounts - critical for nutrition management'
  },
  {
    name: 'Water Intake',
    icon: Droplet,
    createCost: waterCreateTokenCost,
    editCost: waterUpdateTokenCost,
    deleteCost: waterDeleteTokenCost,
    description: 'Monitor hydration levels - essential for health maintenance'
  },
  {
    name: 'Vital Signs',
    icon: Heart,
    createCost: vitalSignsCreateTokenCost,
    editCost: vitalSignsUpdateTokenCost,
    deleteCost: vitalSignsDeleteTokenCost,
    description: 'Monitor heart rate, temperature, and respiratory rate for health assessment'
  },
  {
    name: 'Movement',
    icon: MapPin,
    createCost: movementCreateTokenCost,
    editCost: movementUpdateTokenCost,
    deleteCost: movementDeleteTokenCost,
    description: 'Advanced mobility and movement pattern documentation'
  },
  {
    name: 'Appointments',
    icon: Calendar,
    createCost: appointmentCreateTokenCost,
    editCost: appointmentUpdateTokenCost,
    deleteCost: appointmentDeleteTokenCost,
    description: 'Schedule and track veterinary appointments and visits'
  }
]

export const faqData = [
  {
    question: "What's the benefit of unlimited tokens for special needs pets?",
    answer:
      "Legacy users can document unlimited health events without restrictions - essential for pets requiring frequent monitoring. You can log multiple daily medications, blood sugar checks, or seizure events as often as needed, creating comprehensive personal health records to track your pet's condition and share with your vet when helpful."
  },
  {
    question: 'Do unused tokens carry over to the next period?',
    answer:
      "Free tier tokens reset daily to encourage consistent health monitoring. Paid subscription tiers receive monthly token allowances that don't carry over - they replenish at the start of each billing cycle. Legacy subscribers have unlimited tokens with no restrictions."
  },
  {
    question: 'What types of health conditions can I track with Rosie Paws?',
    answer:
      'Rosie Paws is designed specifically for disabled and end-of-life pets, supporting tracking for conditions like arthritis, mobility issues, epilepsy, diabetes, kidney disease, cancer, heart conditions, and cognitive decline. You can monitor symptoms, treatments, and quality of life indicators for any chronic or terminal condition affecting your beloved companion.'
  },
  {
    question: "Can I share my pet's health data with my veterinarian?",
    answer:
      "Yes! Rosie Paws generates comprehensive health reports from your logged data that you can easily share with your vet during appointments. This detailed history of symptoms, medications, and daily patterns helps your veterinary team make more informed decisions about your pet's care plan."
  },
  {
    question: 'How does Rosie Paws help with end-of-life decision making?',
    answer:
      "By tracking quality of life indicators over time - like pain levels, appetite, mobility, and comfort - Rosie Paws helps you and your vet identify trends and changes in your pet's condition. This objective data can provide clarity during difficult conversations about treatment options and end-of-life care decisions."
  },
  {
    question: 'Can I track multiple pets on one account?',
    answer:
      "Yes! Free users can track one pet, Comfort users can track up to 3 pets, and Legacy users have unlimited pets. Each pet has their own dedicated profile and health log, allowing you to track different conditions and treatments while keeping all your companion animals' records organized in one place."
  },
  {
    question: 'What makes Rosie Paws different from other pet health apps?',
    answer:
      'Unlike general pet apps, Rosie Paws is specifically designed for the unique needs of disabled and end-of-life pets. We focus on quality of life tracking, comfort monitoring, and detailed symptom logging rather than basic wellness features, providing the specialized tools needed for compassionate care during challenging times.'
  },
  {
    question: "How do I get started tracking my pet's condition?",
    answer:
      "Simply create your pet's profile with their basic information and current conditions. Start with daily basics like pain levels and appetite, then add more detailed logs as needed. The app guides you through each entry type, making it easy to build a comprehensive picture of your pet's health journey."
  },
  {
    question: "Is my pet's health data secure and private?",
    answer:
      "Yes, your pet's health information is completely private and secure. All data is encrypted and stored safely, and you control who has access to your pet's records. We never share your personal information or your pet's health data with third parties without your explicit consent."
  },
  {
    question: 'Can I set reminders for medications and appointments?',
    answer:
      "Rosie Paws includes reminder features to help you stay on top of your pet's care routine. You can set notifications for medication times, appointment dates, and regular health checks, ensuring you never miss important aspects of your pet's treatment plan."
  }
]

export const planFeatures = [
  { feature: 'Daily Token Allowance', free: freeTierDailyTokens, comfort: '12,000/month', legacy: 'Unlimited' },
  { feature: 'Pet Profiles', free: '1', comfort: '3', legacy: 'Unlimited' },
  { feature: 'Pain Scoring', free: '✓', comfort: '✓', legacy: '✓' },
  { feature: 'Feeding Tracking', free: '✓', comfort: '✓', legacy: '✓' },
  { feature: 'Water Intake Logging', free: '✓', comfort: '✓', legacy: '✓' },
  { feature: 'Vital Signs Tracking', free: '✗', comfort: '✓', legacy: '✓' },
  { feature: 'Movement & Activity Monitoring', free: '✗', comfort: '✓', legacy: '✓' },
  { feature: 'Medication Management', free: '✗', comfort: '✓', legacy: '✓' },
  { feature: 'Appointment Tracking', free: '✗', comfort: '✗', legacy: '✓' },
  { feature: 'Blood Sugar Monitoring', free: '✗', comfort: '✗', legacy: '✓' },
  { feature: 'Seizure Tracking', free: '✗', comfort: '✗', legacy: '✓' },
  { feature: 'Photo & Video Galleries', free: '✗', comfort: '✓', legacy: '✓' },
  { feature: 'Data Export', free: '✗', comfort: 'Basic', legacy: 'Premium' },
  { feature: 'Support Level', free: 'Email', comfort: '1 ticket/week', legacy: 'Unlimited tickets' },
  { feature: 'Resources', free: '✗', comfort: '✓', legacy: '✓' }
]
