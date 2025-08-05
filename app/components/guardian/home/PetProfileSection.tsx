import { Heart } from 'lucide-react'
import React from 'react'

const PetProfileSection = ({ pet }: any) => {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Pet Profile</h2>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-800">{pet.name}</h3>
        <p className="text-sm text-gray-600">
          {pet.breed} • {pet.age} old
        </p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Weight</span>
          <span className="font-medium text-gray-800">{pet?.weight}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last checkup</span>
          <span className="font-medium text-gray-800">
            <span>{pet.lastVisit?.toLocaleDateString() ?? '--'}</span>
          </span>
        </div>
      </div>
    </>
  )
}

export default PetProfileSection
