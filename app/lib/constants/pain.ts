import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export const PAIN_LEVELS = [
  {
    score: 0,
    label: 'No Pain',
    description: 'Happy and active',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50'
  },
  {
    score: 1,
    label: 'Mild Pain',
    description: 'Slightly uncomfortable',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    score: 2,
    label: 'Moderate Pain',
    description: 'Noticeable discomfort',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  {
    score: 3,
    label: 'Severe Pain',
    description: 'Significant discomfort',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50'
  },
  {
    score: 4,
    label: 'Extreme Pain',
    description: 'Severe distress',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50'
  }
]

export const PAIN_CONTAINER_VARIANTS: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const PAIN_ITEM_VARIANTS: any = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
}

export const getPainConfig = (score: number) => {
  const configs = {
    0: {
      label: 'No Pain',
      color: 'text-green-600 border-green-200 bg-green-100',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      badgeBg: 'bg-green-100',
      ringColor: 'ring-green-200'
    },
    1: {
      label: 'Mild',
      color: 'text-blue-600 border-blue-200 bg-blue-100',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      icon: Activity,
      iconColor: 'text-blue-500',
      badgeBg: 'bg-blue-100',
      ringColor: 'ring-blue-200'
    },
    2: {
      label: 'Moderate',
      color: 'text-yellow-600 border-yellow-200 bg-yellow-100',
      bgGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-500',
      badgeBg: 'bg-yellow-100',
      ringColor: 'ring-yellow-200'
    },
    3: {
      label: 'Severe',
      color: 'text-orange-600 border-orange-200 bg-orange-100',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      badgeBg: 'bg-orange-100',
      ringColor: 'ring-orange-200'
    },
    4: {
      label: 'Extreme',
      color: 'text-red-600 border-red-200 bg-red-100',
      bgGradient: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      badgeBg: 'bg-red-100',
      ringColor: 'ring-red-200'
    }
  }
  return configs[score as keyof typeof configs] || configs[0]
}
