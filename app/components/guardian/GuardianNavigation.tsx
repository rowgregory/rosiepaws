'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { useRouter } from 'next/navigation'
import UserSelectorHeader from './navigation/UserSelectorHeader'
import UserDropdownMenu from './navigation/UserDropdownMenu'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import TokenCounter from './TokenCounter'
import PetDropdownMenu from './navigation/PetDropdownMenu'
import { setOpenPetDrawer, setPet } from '@/app/redux/features/petSlice'
import { guardianLinkData } from '@/app/lib/utils'
import { petCreateTokenCost } from '@/app/lib/constants/token'

const GuardianNavigation = () => {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const { zeroPets, pet, pets } = useAppSelector((state: RootState) => state.pet)
  const { user } = useAppSelector((state: RootState) => state.user)
  const [petDropdownOpen, setPetDropdownOpen] = useState(false)

  const handlePetSelect = (selectedPet: any) => {
    dispatch(setPet(selectedPet))
    setPetDropdownOpen(false)
    push('/guardian/dashboard')
  }

  return (
    <div
      className={`w-64 hidden md:block fixed top-0 left-0 min-h-screen bg-white border-r border-gray-100 z-40 shadow-sm`}
    >
      <Link href="/" className="px-4 flex items-center justify-center border-b-1 border-b-gray-300 h-24">
        <div className="bg-logo bg-center bg-no repeat bg-contain w-[68px] h-[68px]" />
      </Link>

      <div className={`relative flex flex-col items-center justify-center`}>
        <UserSelectorHeader />
        <UserDropdownMenu />
      </div>

      {user.role === 'Free' && (
        <Link
          href="/buy"
          className="mx-auto pl-3 border-1 border-gray-300 rounded-full gap-x-3 flex items-center w-fit"
        >
          <TokenCounter color1="#f472b6" color2="#fb923c" id="pinkToOrange" tokens={user?.tokens} />
          <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-full h-7 flex items-center justify-center text-12 font-semibold text-white px-2 border-1 border-pink-500 hover:bg-gradient-to-r hover:from-zinc-500 hover:to-zinc-600 hover:border-zinc-500">
            Upgrade
          </div>
        </Link>
      )}

      {/* Navigation Links */}
      <div className="pb-4 mt-3">
        <nav className={`space-y-1`}>
          {guardianLinkData(path, zeroPets).map((link, i) => (
            <Link
              key={i}
              href={link.linkKey}
              className={`group flex items-center transition-all duration-200 px-3 py-2.5 justify-between ${link.isActive ? 'bg-gray-50 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-x-3">
                <div className={`flex items-center justify-center`}>
                  <link.icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      link.isActive ? 'text-pink-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                </div>
                <span className={`text-sm font-medium whitespace-nowrap transition-colors duration-200`}>
                  {link.textKey}
                </span>
              </div>
              {link.isActive && <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>}
            </Link>
          ))}
        </nav>
      </div>

      <div
        onClick={() => (zeroPets ? dispatch(setOpenPetDrawer()) : setPetDropdownOpen(!petDropdownOpen))}
        className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 cursor-pointer"
      >
        <div className="flex justify-center items-center gap-x-3">
          {zeroPets ? (
            <div className="w-full flex items-center justify-center gap-x-2 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 px-4 py-2 rounded-full text-white">
              <p>Log pet</p> <TokenCounter tokens={petCreateTokenCost} />
            </div>
          ) : (
            <div className="w-full flex gap-x-3 bg-gray-50 p-3 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-600">X</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{pet?.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <PetDropdownMenu
        setOpenPetDrawer={setOpenPetDrawer}
        setPetDropdownOpen={setPetDropdownOpen}
        pets={pets}
        dispatch={dispatch}
        pet={pet}
        petDropdownOpen={petDropdownOpen}
        handlePetSelect={handlePetSelect}
      />
    </div>
  )
}

export default GuardianNavigation
