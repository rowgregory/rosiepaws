import { ImagePlus } from 'lucide-react'
import React from 'react'
import Picture from '../../common/Picture'
import { formatDate } from '@/app/lib/utils'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenPetDrawer } from '@/app/redux/features/petSlice'
import { setInputs } from '@/app/redux/features/formSlice'

const PetProfileSection = ({ pet }: any) => {
  const dispatch = useAppDispatch()
  return (
    <div
      onClick={() => {
        dispatch(setOpenPetDrawer())
        dispatch(
          setInputs({
            formName: 'petForm',
            data: { ...pet, type: pet.type, isUpdating: true }
          })
        )
      }}
      className="cursor-pointer h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Pet Profile</h2>
        <div className="flex items-center text-sm text-gray-600">
          Last Updated: {formatDate(pet?.updatedAt, { includeTime: true })}
        </div>
      </div>
      <div className="flex justify-center flex-col items-center mb-4">
        {pet?.filePath?.includes?.('/videos') ? (
          <video src={pet.filePath} controls muted autoPlay className="w-32 h-32 rounded-md object-cover mb-4" />
        ) : pet?.filePath?.includes?.('/images') ? (
          <Picture src={pet?.filePath} className="w-24 h-24 rounded-md object-cover mb-4" priority={false} />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-3 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group relative">
            <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors mb-1" />
            <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
              Add Image
            </span>
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity"></div>
          </div>
        )}
        <h3 className="font-semibold text-gray-800">{pet.name}</h3>
        <p className="text-sm text-gray-600">
          {pet.breed} • {pet.age} old
        </p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Weight</span>
          <span className="font-medium text-gray-800">{pet?.weight}lbs</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Gender</span>
          <span className="font-medium text-gray-800">{pet?.gender[0].toUpperCase() + pet?.gender?.slice(1)}</span>
        </div>

        {pet?.microchipId && (
          <div className="flex justify-between">
            <span className="text-gray-600">Microchip ID</span>
            <span className="font-medium text-gray-800">{pet?.microchipId}</span>
          </div>
        )}
        {pet?.lastVisit && (
          <div className="flex justify-between">
            <span className="text-gray-600">Last checkup</span>
            <span className="font-medium text-gray-800">
              <span>{pet.lastVisit?.toLocaleDateString() ?? '--'}</span>
            </span>
          </div>
        )}
        {pet?.emergencyContactName && (
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="text-gray-600">Emergency Contact</span>
            <span className="font-medium text-gray-800">{pet?.emergencyContactName}</span>
          </div>
        )}
        {pet?.emergencyContactPhone && (
          <div className="flex justify-between pt-2">
            <span className="text-gray-600">Emergency Phone</span>
            <span className="font-medium text-gray-800">*** *** {pet?.emergencyContactPhone?.slice(-4)}</span>
          </div>
        )}
        {/* Notes (if present) */}
        {pet?.notes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Notes:</p>
            <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">&quot;{pet.notes}&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PetProfileSection
