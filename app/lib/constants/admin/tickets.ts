import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react'

export const statusButtons = [
  {
    value: 'in_progress',
    label: 'In Progress',
    icon: Clock,
    colors: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 disabled:hover:bg-orange-50'
  },
  {
    value: 'resolved',
    label: 'Resolved',
    icon: CheckCircle,
    colors: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:hover:bg-green-50'
  },
  {
    value: 'open',
    label: 'Reopen',
    icon: AlertCircle,
    colors: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 disabled:hover:bg-blue-50'
  },
  {
    value: 'closed',
    label: 'Close',
    icon: X,
    colors: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 disabled:hover:bg-gray-50'
  }
]
