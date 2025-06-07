import { Pet } from '@/app/types/model.types'
import { PawPrint, Plus } from 'lucide-react'
import React, { FC } from 'react'

interface IPetDropdownMenu {
  zeroPets: boolean
  setOpenPetDrawer: () => void
  setPetDropdownOpen: (petDropdownOpen: boolean) => void
  pets: Pet[]
  dispatch: any
  pet: Pet
  petDropdownOpen: boolean
  toggleSidebar: any
  handlePetSelect: any
}

const PetDropdownMenu: FC<IPetDropdownMenu> = ({
  zeroPets,
  setOpenPetDrawer,
  setPetDropdownOpen,
  pets,
  dispatch,
  pet,
  petDropdownOpen,
  toggleSidebar,
  handlePetSelect
}) => {
  return (
    petDropdownOpen &&
    !toggleSidebar &&
    !zeroPets &&
    pets.length > 1 && (
      <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-64 overflow-y-auto">
        <div className="p-2">
          {pets.map((petItem: any, index: number) => (
            <div
              key={petItem.id || index}
              onClick={() => handlePetSelect(petItem)}
              className={`flex items-center gap-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                pet?.id === petItem.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  pet?.id === petItem.id ? 'bg-indigo-100' : 'bg-purple-100'
                }`}
              >
                <PawPrint className={`w-4 h-4 ${pet?.id === petItem.id ? 'text-indigo-600' : 'text-purple-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{petItem.name}</h3>
                <p className="text-xs text-gray-500 truncate">{petItem.breed || 'Unknown breed'}</p>
              </div>
              {pet?.id === petItem.id && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
            </div>
          ))}
        </div>

        {/* Add New Pet Option */}
        <div className="border-t border-gray-100 p-2">
          <div
            onClick={() => {
              dispatch(setOpenPetDrawer())
              setPetDropdownOpen(false)
            }}
            className="flex items-center gap-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Plus className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Add New Pet</h3>
              <p className="text-xs text-gray-500">Register another pet</p>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default PetDropdownMenu
