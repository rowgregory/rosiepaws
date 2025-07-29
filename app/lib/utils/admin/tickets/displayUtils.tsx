import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

export const getTicketPriorityColor = (priority: any) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50'
    case 'low':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const getTicketStatusColor = (status: any) => {
  switch (status) {
    case 'open':
      return 'text-blue-600 bg-blue-50'
    case 'in_progress':
      return 'text-orange-600 bg-orange-50'
    case 'resolved':
      return 'text-green-600 bg-green-50'
    case 'closed':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const getTicketPriorityIcon = (priority: any) => {
  switch (priority) {
    case 'high':
      return <ArrowUp className="w-4 h-4" />
    case 'medium':
      return <Minus className="w-4 h-4" />
    case 'low':
      return <ArrowDown className="w-4 h-4" />
    default:
      return <Minus className="w-4 h-4" />
  }
}

export const getTicketStatusLabel = (status: any) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    case 'open':
      return 'Open'
    case 'resolved':
      return 'Resolved'
    case 'closed':
      return 'Closed'
    default:
      return status
  }
}
