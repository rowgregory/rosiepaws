import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

const PetStatusBadge = ({ hasNotes, updatedRecently }: { hasNotes: any; updatedRecently: boolean }) => {
  let config: { color: string; icon: any; label: string }

  if (updatedRecently) {
    config = { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' }
  } else if (hasNotes) {
    config = { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Needs Attention' }
  } else {
    config = { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Inactive' }
  }

  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

export default PetStatusBadge
