import { IMedication } from '@/app/types'
import { CheckCircle, XCircle, Calendar } from 'lucide-react'

export const getMedicationStatus = (medication: IMedication) => {
  const now = new Date()
  const startDate = new Date(medication.startDate)
  const endDate = medication.endDate ? new Date(medication.endDate) : null

  // Check if expired
  if (endDate && endDate < now) {
    return {
      icon: XCircle,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      label: 'Expired',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-900',
      description: 'Treatment period ended'
    }
  }

  // Check if not started yet
  if (startDate > now) {
    return {
      icon: Calendar,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Scheduled',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: 'Treatment not started yet'
    }
  }

  // Active medication
  return {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Active',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    description: 'Currently active'
  }
}

export const getFrequencyDisplay = (frequency: string, customFrequency?: string) => {
  if (frequency === 'custom' && customFrequency) {
    return customFrequency
  }

  const frequencyMap: Record<string, string> = {
    'once-daily': 'Once daily',
    'twice-daily': 'Twice daily',
    'three-times-daily': '3x daily',
    'four-times-daily': '4x daily',
    'every-other-day': 'Every other day',
    weekly: 'Weekly',
    'as-needed': 'As needed'
  }

  return frequencyMap[frequency] || frequency
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'text-blue-600'
    case 'completed':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'Upcoming'
    case 'completed':
      return 'Given'
    default:
      return 'Scheduled'
  }
}

// Helper function to get default reminder times based on frequency
export const getDefaultReminderTimes = (frequency: string): string[] => {
  switch (frequency) {
    case 'once-daily':
      return ['08:00'] // Morning dose

    case 'twice-daily':
      return ['08:00', '20:00'] // Morning and evening (12 hours apart)

    case 'three-times-daily':
      return ['08:00', '14:00', '20:00'] // Morning, afternoon, evening (6-8 hours apart)

    case 'four-times-daily':
      return ['08:00', '12:00', '16:00', '20:00'] // Every 6 hours

    case 'every-other-day':
      return ['08:00'] // Same time on scheduled days

    case 'weekly':
      return ['08:00'] // Same time weekly

    case 'as-needed':
      return [] // No scheduled reminders for PRN medications

    case 'custom':
      return ['08:00'] // Default single time, user can customize

    default:
      return ['08:00'] // Fallback to morning dose
  }
}
