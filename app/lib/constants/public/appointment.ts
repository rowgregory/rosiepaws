import { AppointmentStatus, AppointmentType } from '@/app/types/entities'
import { AlertTriangle, CheckCircle2, Clock, Heart, PawPrint, Stethoscope } from 'lucide-react'

export const serviceTypes = [
  { value: 'CHECKUP', label: 'Regular Checkup', icon: '🔍' },
  { value: 'VACCINATION', label: 'Vaccination', icon: '💉' },
  { value: 'GROOMING', label: 'Grooming', icon: '✂️' },
  { value: 'DENTAL', label: 'Dental Care', icon: '🦷' },
  { value: 'SURGERY', label: 'Surgery', icon: '🏥' },
  { value: 'EMERGENCY', label: 'Emergency', icon: '🚨' },
  { value: 'CONSULTATION', label: 'Consultation', icon: '💬' }
]

export const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00'
]

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
}

// Service type display names and icons
export const serviceTypeConfig: any = {
  [AppointmentType.CHECKUP]: {
    label: 'Regular Checkup',
    icon: '🔍',
    color: 'bg-blue-100 text-blue-800'
  },
  [AppointmentType.VACCINATION]: {
    label: 'Vaccination',
    icon: '💉',
    color: 'bg-green-100 text-green-800'
  },
  [AppointmentType.GROOMING]: {
    label: 'Grooming',
    icon: '✂️',
    color: 'bg-purple-100 text-purple-800'
  },
  [AppointmentType.DENTAL]: {
    label: 'Dental Care',
    icon: '🦷',
    color: 'bg-yellow-100 text-yellow-800'
  },
  [AppointmentType.SURGERY]: {
    label: 'Surgery',
    icon: '🏥',
    color: 'bg-red-100 text-red-800'
  },
  [AppointmentType.EMERGENCY]: {
    label: 'Emergency',
    icon: '🚨',
    color: 'bg-red-100 text-red-800'
  },
  [AppointmentType.CONSULTATION]: {
    label: 'Consultation',
    icon: '💬',
    color: 'bg-indigo-100 text-indigo-800'
  }
}

// Status display configuration
export const statusConfig: any = {
  [AppointmentStatus.SCHEDULED]: {
    label: 'Scheduled',
    color: 'bg-blue-100 text-blue-800'
  },
  [AppointmentStatus.CONFIRMED]: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-800'
  },
  [AppointmentStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800'
  },
  [AppointmentStatus.COMPLETED]: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800'
  },
  [AppointmentStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800'
  },
  [AppointmentStatus.RESCHEDULED]: {
    label: 'Rescheduled',
    color: 'bg-orange-100 text-orange-800'
  }
}

export const tips = [
  {
    id: 'preparation',
    title: 'Before Your Visit',
    description: 'Essential steps to prepare your pet for a successful veterinary appointment',
    icon: CheckCircle2,
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    iconColor: 'text-blue-600',
    items: [
      'Fast your pet 12 hours before surgery appointments',
      'Bring any medications your pet is currently taking',
      'List any recent changes in behavior or appetite',
      'Prepare questions you want to ask the veterinarian',
      'Bring a favorite toy or blanket for comfort'
    ]
  },
  {
    id: 'scheduling',
    title: 'Best Times to Schedule',
    description: "Optimal appointment timing for your pet's comfort and clinic efficiency",
    icon: Clock,
    color: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-600',
    items: [
      'Morning appointments: Pets are usually calmer',
      'Avoid busy periods: Skip lunch hours when possible',
      'Regular checkups: Every 6-12 months for healthy pets',
      'Senior pets (7+ years): Every 6 months recommended',
      'Emergency slots: Available for urgent situations'
    ]
  },
  {
    id: 'services',
    title: 'Common Services',
    description: "Comprehensive veterinary care options available for your pet's health needs",
    icon: Stethoscope,
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    iconColor: 'text-purple-600',
    items: [
      'Annual wellness exams and vaccinations',
      'Dental cleanings and oral health checks',
      'Spay/neuter and other surgical procedures',
      'Emergency care for accidents or illness',
      'Grooming and nail trimming services'
    ]
  },
  {
    id: 'emergencies',
    title: 'When to Seek Emergency Care',
    description: 'Critical warning signs that require immediate veterinary attention',
    icon: AlertTriangle,
    color: 'bg-red-50 border-red-200 text-red-800',
    iconColor: 'text-red-600',
    items: [
      'Difficulty breathing or excessive panting',
      'Severe vomiting or diarrhea',
      'Signs of pain: whimpering, hiding, aggression',
      'Suspected poisoning or toxic ingestion',
      'Injuries from accidents or fights'
    ]
  }
]

export const quickFacts = [
  {
    icon: PawPrint,
    title: 'Dogs',
    facts: ['First puppy visit: 6-8 weeks old', 'Adult vaccines: Annually', 'Dental care: Start at 6 months']
  },
  {
    icon: Heart,
    title: 'Cats',
    facts: ['First kitten visit: 6-8 weeks old', 'Indoor cats: Annual checkups', 'Spay/neuter: 4-6 months old']
  }
]
