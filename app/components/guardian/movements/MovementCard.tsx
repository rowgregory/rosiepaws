import React from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, AlertTriangle } from 'lucide-react'
import { IMovement } from '@/app/types'
import {
  getActivityLevelColor,
  getConcerningSigns,
  getEnergyTrend,
  getMovementTypeIcon,
  getPainTrend
} from '@/app/lib/utils'

interface MovementCardProps {
  movement: IMovement
  index: number
  showAll?: boolean
}

export const MovementCard: React.FC<MovementCardProps> = ({ movement, index, showAll = false }) => {
  const typeInfo = getMovementTypeIcon(movement.movementType)
  const TypeIcon = typeInfo.icon
  const painTrend = getPainTrend(movement)
  const energyTrend = getEnergyTrend(movement)
  const concerningSigns = getConcerningSigns(movement)
  const isOld = showAll && new Date(movement.timeRecorded) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${
        isOld ? 'opacity-75 border-gray-200' : 'border-gray-100'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gray-50 ${typeInfo.color}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {movement.movementType
                  .replace('_', ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </h3>
              <p className="text-xs text-gray-500">{movement.pet?.name}</p>
            </div>
          </div>

          {/* Activity Level Badge */}
          {movement.activityLevel && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getActivityLevelColor(movement.activityLevel)}`}
            >
              {movement.activityLevel.replace('_', ' ').toLowerCase()}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Duration and Distance */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{movement.durationMinutes || '0'} min</span>
          </div>
          {movement.distanceMeters && (
            <div className="text-gray-600">
              {movement.distanceMeters >= 1000
                ? `${(movement.distanceMeters / 1000).toFixed(1)}km`
                : `${movement.distanceMeters}m`}
            </div>
          )}
        </div>

        {/* Location */}
        {movement.location && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{movement.location}</span>
            {movement.indoor && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Indoor</span>}
          </div>
        )}

        {/* Pain and Energy Trends */}
        <div className="flex items-center justify-between">
          {painTrend && (
            <div className="flex items-center space-x-1">
              <painTrend.icon className={`w-4 h-4 ${painTrend.color}`} />
              <span className="text-xs text-gray-600">Pain</span>
            </div>
          )}
          {energyTrend && (
            <div className="flex items-center space-x-1">
              <energyTrend.icon className={`w-4 h-4 ${energyTrend.color}`} />
              <span className="text-xs text-gray-600">Energy</span>
            </div>
          )}
        </div>

        {/* Concerning Signs Alert */}
        {concerningSigns.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <div className="flex items-center space-x-1 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-800">Concerns Noted</span>
            </div>
            <div className="text-xs text-yellow-700">{concerningSigns.join(', ')}</div>
          </div>
        )}

        {/* Equipment Used */}
        {(movement.wheelchair || movement.harness || movement.leash) && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Equipment:</span>
            <div className="flex space-x-1">
              {movement.wheelchair && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Wheelchair</span>
              )}
              {movement.harness && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Harness</span>
              )}
              {movement.leash && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Leash</span>}
            </div>
          </div>
        )}

        {/* Assistance Level */}
        {movement.assistance && movement.assistance !== 'NONE' && (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Assistance:</span> {movement.assistance.replace('_', ' ').toLowerCase()}
          </div>
        )}

        {/* Rest and Recovery */}
        {(movement.restBreaks && movement.restBreaks > 0) ||
          (movement.recoveryTime && movement.recoveryTime > 0 && (
            <div className="text-xs text-gray-600 space-y-1">
              {movement.restBreaks && movement.restBreaks > 0 && <div>Rest breaks: {movement.restBreaks}</div>}
              {movement.recoveryTime && movement.recoveryTime > 0 && (
                <div>Recovery time: {movement.recoveryTime} min</div>
              )}
            </div>
          ))}

        {/* Notes Preview */}
        {movement.notes && (
          <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
            <span className="font-medium">Notes:</span> {movement.notes.slice(0, 60)}
            {movement.notes.length > 60 && '...'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(movement.timeRecorded).toLocaleDateString()}</span>
          <span>
            {new Date(movement.timeRecorded).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
