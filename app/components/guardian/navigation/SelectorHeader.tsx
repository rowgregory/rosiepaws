import React, { FC } from 'react'
import Spinner from '../../common/Spinner'
import { ChevronDown, PawPrint, Plus } from 'lucide-react'
import { Pet } from '@/app/types/model.types'

interface IPetSelectorHeader {
  zeroPets: boolean
  setOpenPetDrawer: () => void
  setPetDropdownOpen: (petDropdownOpen: boolean) => void
  pets: Pet[]
  dispatch: any
  loading: boolean
  pet: Pet
  petDropdownOpen: boolean
  toggleSidebar: any
}

const PetSelectorHeader: FC<IPetSelectorHeader> = ({
  zeroPets,
  setOpenPetDrawer,
  setPetDropdownOpen,
  pets,
  dispatch,
  loading,
  pet,
  petDropdownOpen,
  toggleSidebar
}) => {
  const togglePetDropdown = () => {
    if (zeroPets) {
      dispatch(setOpenPetDrawer())
    } else if (pets.length > 1) {
      setPetDropdownOpen(!petDropdownOpen)
    }
  }

  return (
    <div
      onClick={togglePetDropdown}
      className={`rounded-xl w-full p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex items-center ${
        toggleSidebar ? 'w-fit justify-center' : 'justify-between'
      }`}
    >
      <div className="flex gap-x-3 items-center">
        <div
          className={`w-8 h-8 rounded-lg ${
            zeroPets ? 'bg-indigo-100' : 'bg-purple-100'
          } flex items-center justify-center`}
        >
          {zeroPets ? <Plus className="w-4 h-4 text-indigo-600" /> : <PawPrint className="w-4 h-4 text-purple-600" />}
        </div>
        {loading ? (
          <Spinner fill="fill-indigo-500" track="text-gray-200" wAndH="w-4 h-4" />
        ) : (
          <div className={`${toggleSidebar ? 'hidden' : 'block'}`}>
            <h1 className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              {zeroPets ? 'Add Pet' : pet?.name}
            </h1>
            {!zeroPets && pet?.name && <p className="text-xs text-gray-500">{pet?.breed || 'Sheepapoodle'}</p>}
          </div>
        )}
      </div>
      <ChevronDown
        className={`${
          toggleSidebar || zeroPets ? 'hidden' : 'block'
        } w-4 h-4 text-gray-400 transition-transform duration-200 ${petDropdownOpen ? 'rotate-180' : ''}`}
      />
    </div>
  )
}

export default PetSelectorHeader
