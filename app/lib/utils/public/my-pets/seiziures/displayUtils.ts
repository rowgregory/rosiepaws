import { SeizureSeverity } from '@/app/lib/constants'
import { AlertCircle, AlertTriangle, Clock, Shield, Zap } from 'lucide-react'

export const getSeizureSeverity = (duration?: number) => {
  if (!duration) {
    return {
      icon: Clock,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      label: 'Unknown',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-900',
      description: 'Duration not recorded',
      priority: 'unknown'
    }
  }

  if (duration < 30) {
    // Less than 30 seconds
    return {
      icon: Shield,
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Brief',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      description: 'Short duration seizure',
      priority: 'low'
    }
  } else if (duration <= 120) {
    // Up to 2 minutes (120 seconds)
    return {
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Moderate',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: 'Moderate duration seizure',
      priority: 'medium'
    }
  } else if (duration <= 299) {
    // Up to 5 minutes (300 seconds)
    return {
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      label: 'Extended',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-900',
      description: 'Extended duration seizure',
      priority: 'high'
    }
  } else {
    // Over 5 minutes (300+ seconds)
    return {
      icon: Zap,
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Emergency',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      description: 'Emergency - requires immediate attention',
      priority: 'critical'
    }
  }
}

export const getEmergencyLevel = (duration?: number) => {
  if (!duration) return { level: 'Monitor', color: 'text-gray-600' }
  if (duration < 30) return { level: 'Normal', color: 'text-green-600' } // Less than 30 seconds
  if (duration <= 120) return { level: 'Monitor closely', color: 'text-yellow-600' } // Up to 2 minutes
  if (duration <= 299) return { level: 'Contact vet', color: 'text-orange-600' } // Up to 5 minutes
  return { level: 'EMERGENCY', color: 'text-red-600' } // Over 5 minutes
}

// Get background color based on seizure severity
export const getSeverityColor: any = (severity?: SeizureSeverity) => {
  switch (severity) {
    case SeizureSeverity.MILD:
      return 'bg-yellow-100'
    case SeizureSeverity.MODERATE:
      return 'bg-amber-100'
    case SeizureSeverity.SEVERE:
      return 'bg-orange-200'
    case SeizureSeverity.CRITICAL:
      return 'bg-red-200'
    default:
      return 'bg-white'
  }
}
