import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, AlertTriangle, Calendar, Video, FileText } from 'lucide-react'

const GuardianSeizureGridCard = ({ seizure, index, emergencyStatus, duration, setSelectedVideo }: any) => {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDurationColor = (duration: number) => {
    if (duration >= 300) return 'text-red-600 bg-red-50' // 5+ minutes
    if (duration >= 180) return 'text-orange-600 bg-orange-50' // 3+ minutes
    if (duration >= 60) return 'text-yellow-600 bg-yellow-50' // 1+ minute
    return 'text-green-600 bg-green-50' // Under 1 minute
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{seizure.pet?.name || 'Unknown Pet'}</h3>
            <p className="text-sm text-gray-500">{seizure.pet?.breed}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${emergencyStatus.color}`}>
          {emergencyStatus.text}
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(seizure.timeTaken)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatTime(seizure.timeTaken)}</span>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Duration</span>
          <div className={`px-2 py-1 rounded-lg text-sm font-medium ${getDurationColor(duration)}`}>
            {formatDuration(duration)}
          </div>
        </div>

        {/* Duration Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              duration >= 300
                ? 'bg-red-500'
                : duration >= 180
                  ? 'bg-orange-500'
                  : duration >= 60
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((duration / 300) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0s</span>
          <span>5m</span>
        </div>
      </div>

      {/* Video */}
      {seizure.videoUrl && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <Video className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Video recorded</span>
            <button
              onClick={() =>
                setSelectedVideo({
                  url: seizure.videoUrl!,
                  filename: seizure.videoFilename,
                  petName: seizure.pet?.name,
                  date: formatDate(seizure.timeTaken)
                })
              }
              className="ml-auto text-purple-600 hover:text-purple-800 transition-colors"
            >
              <span className="text-xs">View</span>
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      {seizure.notes && (
        <div className="mb-4">
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-3">{seizure.notes}</p>
          </div>
        </div>
      )}

      {/* Emergency Warning */}
      {emergencyStatus.level === 'emergency' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Emergency Alert</p>
              <p className="text-xs text-red-600">Contact veterinarian immediately</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default GuardianSeizureGridCard
