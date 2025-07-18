import {
  Coins,
  Heart,
  Droplet,
  Play,
  MapPin,
  Calendar,
  Pill,
  Activity,
  Zap,
  HelpCircle,
  UtensilsCrossed
} from 'lucide-react'

export const tabs = [
  { id: 'tokens', label: 'Token System', icon: Coins },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'actions', label: 'Token Actions', icon: Play }
]

export const tokenActions = [
  { name: 'Log Pain', cost: 75, icon: Heart, description: 'Record pain levels and symptoms' },
  { name: 'Log Feeding', cost: 85, icon: UtensilsCrossed, description: 'Track feeding times and amounts' },
  { name: 'Log Water', cost: 90, icon: Droplet, description: 'Monitor water intake and hydration' },
  { name: 'Log Walks', cost: 125, icon: MapPin, description: 'Record walk duration and activity' },
  { name: 'Log Movement', cost: 225, icon: Activity, description: 'Track mobility and exercise sessions' },
  { name: 'Log Appointments', cost: 150, icon: Calendar, description: 'Track vet visits and checkups' },
  { name: 'Log Medications', cost: 225, icon: Pill, description: 'Monitor medication schedules' },
  { name: 'Log Blood Sugar', cost: 300, icon: Activity, description: 'Track blood glucose levels' },
  { name: 'Log Seizure Tracking', cost: 400, icon: Zap, description: 'Record seizure events and details' }
]

export const faqData = [
  {
    question: 'Why do different health logs cost different amounts of tokens?',
    answer:
      'Token costs reflect the complexity and critical importance of each health metric for disabled and end-of-life pets. Basic comfort logs like pain (75 tokens) and feeding (85 tokens) are simple daily entries, while specialized tracking like blood sugar (300 tokens) and seizures (400 tokens) require detailed medical documentation crucial for veterinary care.'
  },
  {
    question: 'Why do feeding and water logs cost 85-90 tokens each?',
    answer:
      "For disabled and end-of-life pets, nutrition and hydration tracking is essential for maintaining quality of life. Feeding (85 tokens) and water (90 tokens) ensure these vital daily metrics remain accessible while encouraging consistent monitoring of your pet's basic needs."
  },
  {
    question: 'What makes seizure tracking cost 400 tokens?',
    answer:
      "Seizure tracking (400 tokens) is critical for pets with neurological conditions or end-of-life care. It requires detailed medical documentation including timestamps, duration, triggers, and recovery patterns - information that's vital for veterinary decisions and emergency care protocols."
  },
  {
    question: 'How much do movement and mobility logs cost?',
    answer:
      'Mobility tracking varies by complexity: walks cost 125 tokens for basic activity tracking, while comprehensive movement logs cost 225 tokens and include detailed mobility assessments, gait quality, energy levels, and equipment usage - essential for monitoring disabled pets.'
  },
  {
    question: 'What about medication tracking costs?',
    answer:
      "Medication tracking (225 tokens) provides comprehensive dosage schedules and administration records. The cost reflects the detailed medication management features that help you maintain accurate records for your pet's treatment plan."
  },
  {
    question: 'How do token allowances work for different subscription tiers?',
    answer:
      'Free users receive 750 tokens daily that reset each day and can only log pain, feeding, and water. Comfort subscribers ($11.99) get 45,000 tokens monthly with access to all features. Companion subscribers ($22.99) receive 120,000 tokens monthly. Legacy subscribers ($34.99) have unlimited tokens.'
  },
  {
    question: 'Do unused tokens carry over to the next period?',
    answer:
      "Free tier tokens reset daily to encourage consistent health monitoring. Paid subscription tiers receive monthly token allowances that don't carry over - they replenish at the start of each billing cycle. Legacy subscribers have unlimited tokens with no restrictions."
  },
  {
    question: "What's the benefit of unlimited tokens for special needs pets?",
    answer:
      'Legacy users can document unlimited health events without restrictions - essential for pets requiring frequent monitoring, emergency care documentation, or end-of-life comfort tracking. This ensures comprehensive medical records that you can share with your veterinarian for better care decisions.'
  }
]

export const planFeatures = [
  {
    feature: 'Token Allowance',
    free: '750 Daily',
    comfort: '45,000 Monthly',
    companion: '120,000 Monthly',
    legacy: 'Unlimited'
  },
  {
    feature: 'Basic Care Logs (Pain, Feeding, Water)',
    free: '✓',
    comfort: '✓',
    companion: '✓',
    legacy: '✓'
  },
  {
    feature: 'Mobility Tracking (Walks, Movement)',
    free: '✗',
    comfort: '✓',
    companion: '✓',
    legacy: '✓'
  },
  {
    feature: 'Medical Records (Appointments, Medications)',
    free: '✗',
    comfort: '✓',
    companion: '✓',
    legacy: '✓'
  },
  {
    feature: 'Critical Health Monitoring (Blood Sugar, Seizures)',
    free: '✗',
    comfort: 'Limited',
    companion: '✓',
    legacy: '✓'
  },
  {
    feature: 'Data Export & Sharing',
    free: '✗',
    comfort: '✗',
    companion: '✓',
    legacy: '✓'
  },
  {
    feature: 'Veterinary Report Generation',
    free: '✗',
    comfort: '✗',
    companion: '✓',
    legacy: '✓'
  },
  {
    feature: 'End-of-Life Care Documentation',
    free: '✗',
    comfort: '✗',
    companion: '✓',
    legacy: '✓'
  },
  {
    feature: 'Emergency Health Alerts',
    free: '✗',
    comfort: '✗',
    companion: '✗',
    legacy: '✓'
  },
  {
    feature: '24/7 Support for Critical Care',
    free: '✗',
    comfort: '✗',
    companion: '✗',
    legacy: '✓'
  },
  {
    feature: 'Dr. Jaci Coble Veterinary Ebook Collection',
    free: '✗',
    comfort: '✗',
    companion: '✗',
    legacy: '✓'
  }
]
