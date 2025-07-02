import useCustomPathname from '@/app/hooks/useCustomPathname'
import React, { MouseEvent, useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setOpenPetDrawer, setPet } from '@/app/redux/features/petSlice'
import { useLogoutMutation } from '@/app/redux/services/authApi'
import { setAuthState } from '@/app/redux/features/authSlice'
import { useRouter } from 'next/navigation'
import Spinner from '../common/Spinner'
import { guardianLinkData } from '@/app/lib/navigation'
import PetSelectorHeader from './navigation/SelectorHeader'
import PetDropdownMenu from './navigation/PetDropdownMenu'

const GuardianNavigation = ({ toggleSidebar, setToggleSidebar }: any) => {
  const path = useCustomPathname()
  const { zeroPets, pet, pets, loading } = useAppSelector((state: RootState) => state.pet)
  const dispatch = useAppDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const { push } = useRouter()
  const [petDropdownOpen, setPetDropdownOpen] = useState(false)

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault()

    try {
      await logout({}).unwrap()

      dispatch(setAuthState({ isAuthenticated: false, id: '', role: '' }))
      push('/auth/login')
    } catch {}
  }

  const handlePetSelect = (selectedPet: any) => {
    dispatch(setPet(selectedPet))
    setPetDropdownOpen(false)
    push('/guardian/dashboard')
  }

  return (
    <div
      className={`${
        toggleSidebar ? 'w-16' : 'w-64'
      } hidden lg:block fixed top-[81px] left-0 min-h-screen bg-white border-r border-gray-100 z-20 shadow-sm`}
    >
      {/* Pet Selector Header */}
      <div
        className={`relative px-4 h-16 flex items-center border-b border-gray-50 ${
          toggleSidebar ? 'justify-center' : ''
        }`}
      >
        <PetSelectorHeader
          zeroPets={zeroPets}
          setOpenPetDrawer={setOpenPetDrawer}
          setPetDropdownOpen={setPetDropdownOpen}
          pets={pets}
          dispatch={dispatch}
          loading={loading}
          pet={pet}
          petDropdownOpen={petDropdownOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Pet Dropdown Menu */}
        <PetDropdownMenu
          zeroPets={zeroPets}
          setOpenPetDrawer={setOpenPetDrawer}
          setPetDropdownOpen={setPetDropdownOpen}
          pets={pets}
          dispatch={dispatch}
          pet={pet}
          petDropdownOpen={petDropdownOpen}
          toggleSidebar={toggleSidebar}
          handlePetSelect={handlePetSelect}
        />
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setToggleSidebar(!toggleSidebar)}
        className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center text-gray-400 hover:text-gray-600"
      >
        {toggleSidebar ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation Links */}
      <div className="pt-6 pb-4">
        <nav className={`px-3 space-y-1 ${toggleSidebar ? 'flex flex-col items-center' : ''}`}>
          {guardianLinkData(path).map((link, i) => (
            <Link
              onClick={(e) => (link.textKey === 'Logout' ? handleLogout(e) : {})}
              key={i}
              href={link.linkKey}
              className={`group flex items-center rounded-xl transition-all duration-200 ${
                toggleSidebar ? 'w-10 h-10 justify-center p-2' : 'px-3 py-2.5 justify-between'
              } ${
                link.isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-x-3">
                <div className={`flex items-center justify-center ${toggleSidebar ? 'w-5 h-5' : 'w-5 h-5'}`}>
                  {isLoading && link.textKey === 'Logout' ? (
                    <Spinner fill="fill-indigo-500" track="text-gray-200" wAndH="w-4 h-4" />
                  ) : (
                    <link.icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        link.isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`${
                    toggleSidebar ? 'hidden' : 'block'
                  } text-sm font-medium whitespace-nowrap transition-colors duration-200`}
                >
                  {link.textKey}
                </span>
              </div>

              {/* Active indicator */}
              {link.isActive && !toggleSidebar && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom section for additional info when expanded */}
      {!toggleSidebar && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-x-3 p-3 rounded-xl bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-600">X</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Xyla</p>
              <p className="text-xs text-gray-500">Guardian Account</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuardianNavigation
