// lib/admin/logs/displayUtils.tsx
import { AlertTriangle, Bug, FileText, Info, XCircle } from 'lucide-react'

export const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'warn':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'debug':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getLevelIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case 'error':
      return <XCircle className="w-4 h-4" />
    case 'warn':
      return <AlertTriangle className="w-4 h-4" />
    case 'info':
      return <Info className="w-4 h-4" />
    case 'debug':
      return <Bug className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}
