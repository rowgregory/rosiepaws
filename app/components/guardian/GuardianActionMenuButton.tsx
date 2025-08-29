import React from 'react'
import { Menu } from 'lucide-react'
import { useAppDispatch, usePetSelector } from '@/app/redux/store'
import { setOpenGuardianActionMenu, setOpenPetDrawer } from '@/app/redux/features/petSlice'

const GuardianActionMenuButton = () => {
  const dispatch = useAppDispatch()
  const { zeroPets } = usePetSelector()

  return (
    <button
      onClick={() => (zeroPets ? dispatch(setOpenPetDrawer()) : dispatch(setOpenGuardianActionMenu()))}
      className={`flex flex-shrink-0 lg:hidden
        relative group items-center justify-center
        w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 
        hover:from-pink-600 hover:to-orange-700
        rounded-xl shadow-lg hover:shadow-xl
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95`}
      aria-label="Open Guardian Actions Menu"
    >
      {/* Main Icon */}
      <div className="relative">
        <Menu className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
      </div>
    </button>
  )
}

export default GuardianActionMenuButton
