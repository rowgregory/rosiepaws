import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' }
      case 'past_due':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Past Due' }
      case 'canceled':
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Canceled' }
      case 'incomplete':
        return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Incomplete' }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactive' }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

export default StatusBadge
