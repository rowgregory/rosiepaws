'use client'

import GuardianPageHeader from '@/app/components/guardian/GuardianPageHeader'
import { getFoodTypeColor } from '@/app/forms/feeding-form/constants'
import { formatTimeAgo } from '@/app/lib/utils/date'
import { setOpenFeedingDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import { Clock, Plus, Utensils } from 'lucide-react'
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
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <GuardianPageHeader
          Icon={Utensils}
          data={feedings}
          title="Feedings"
          subtitle="Track meals and nutrition habits"
          setOpenDrawer={setOpenFeedingDrawer}
          btnText="Feeding"
          overlayGradient="bg-gradient-to-r from-green-500/10 to-emerald-500/10"
          iconGradient="bg-gradient-to-br from-green-500 to-emerald-500"
          buttonGradient="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        />

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
                    <span className="text-13">{feeding?.pet?.type === 'DOG' ? '🐶' : '🐈'}</span>
                  </div>

                  {/* Feeding Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{feeding?.pet?.name}</h4>
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
      </div>
    </div>
  )
}

export default Feedings
