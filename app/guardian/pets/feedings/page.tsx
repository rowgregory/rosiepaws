'use client'

import { getFoodTypeColor, getTodaysFeedings } from '@/app/forms/feeding-form/constants'
import { formatTimeAgo } from '@/app/lib/utils/date'
import { RootState, useAppSelector } from '@/app/redux/store'
import { Calendar, Clock, Plus, TrendingUp, Utensils } from 'lucide-react'
import React from 'react'

const Feedings = () => {
  const { zeroFeedings, feedings } = useAppSelector((state: RootState) => state.pet)

  if (zeroFeedings) {
    return (
      <div className="mt-24">
        <div className="max-w-80 mx-auto w-full text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mx-auto mb-4">
            <Utensils className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-xl text-gray-900 font-bold mb-2">Start tracking feedings</h1>
          <p className="text-gray-600 text-sm mb-6">Keep your pets healthy with consistent feeding logs</p>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium flex items-center gap-x-2 mx-auto transition-colors">
            <Plus className="w-4 h-4" />
            Add first feeding
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-full mr-3">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{getTodaysFeedings(feedings)}</p>
              <p className="text-sm text-green-600">Today&apos;s feedings</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-full mr-3">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{feedings.length}</p>
              <p className="text-sm text-blue-600">Total logged</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedings</h3>
        {feedings.map((feeding) => (
          <div
            key={feeding.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Pet Avatar */}
                <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-13">{feeding.pet.type === 'DOG' ? '🐶' : '🐈'}</span>
                </div>

                {/* Feeding Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{feeding.pet.name}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getFoodTypeColor(
                        feeding.foodType
                      )}`}
                    >
                      {feeding.foodType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Utensils className="w-4 h-4 mr-1" />
                      <span>{feeding.foodAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatTimeAgo(feeding.createdAt)}</span>
                    </div>
                  </div>

                  {feeding.notes && (
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-md">
                      &quot;{feeding.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Time Display */}
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {new Date(feeding.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(feeding.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-6 text-center">
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">Load more feedings</button>
      </div>
    </div>
  )
}

export default Feedings
