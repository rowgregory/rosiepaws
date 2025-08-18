'use client'

import React, { FC, useState } from 'react'
import Link from 'next/link'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { useRouter } from 'next/navigation'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import PetDropdownMenu from './navigation/PetDropdownMenu'
import { setOpenPetDrawer, setSelectedPetWithChartData } from '@/app/redux/features/petSlice'
import { processChartDataForPet } from '@/app/lib/utils/public/dashboard/processChartData'
import { calculatePetStats } from '@/app/lib/utils/public/dashboard/calculatePetStats'
import { publicDashboardLinks } from '@/app/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Spinner from '../common/Spinner'
import TokensSVG from '@/public/svg/TokensSVG'

const GuardianNavigation: FC<{ toggleSidebar: boolean; setToggleSidebar: any }> = ({
  toggleSidebar,
  setToggleSidebar
}) => {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const { zeroPets, pet, pets } = useAppSelector((state: RootState) => state.pet)
  const { user } = useAppSelector((state: RootState) => state.user)
  const [petDropdownOpen, setPetDropdownOpen] = useState(false)
  const linkData = publicDashboardLinks(path, zeroPets)
  const [isLoading, setIsLoading] = useState(false)

  const handlePetSelect = (selectedPet: any) => {
    setPetDropdownOpen(false)
    push('/guardian/dashboard')
    const chartData = processChartDataForPet(selectedPet)
    const stats = calculatePetStats(selectedPet, chartData)
    dispatch(
      setSelectedPetWithChartData({
        pet: selectedPet,
        chartData,
        stats
      })
    )
  }

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await signOut({
        redirect: false, // Prevent automatic redirect
        callbackUrl: '/auth/login' // Optional: specify where to redirect after signout
      })

      push('/auth/login')
      setIsLoading(false)
    } catch {}
  }

  return (
    <>
      <PetDropdownMenu
        setOpenPetDrawer={setOpenPetDrawer}
        setPetDropdownOpen={setPetDropdownOpen}
        pets={pets}
        dispatch={dispatch}
        pet={pet}
        petDropdownOpen={petDropdownOpen}
        handlePetSelect={handlePetSelect}
        zeroPets={zeroPets}
        user={user}
      />
      <motion.div
        animate={{ width: toggleSidebar ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block fixed top-0 left-0 min-h-screen bg-white border-r border-gray-200 z-20"
      >
        {/* Header Section */}
        <div
          className={`relative h-16 flex items-center border-b border-gray-100 ${
            toggleSidebar ? 'justify-center px-2' : 'px-6'
          }`}
        >
          <AnimatePresence mode="wait">
            {!toggleSidebar ? (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0)}</span>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Guardian Panel</h2>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-header"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Token */}
        <Link
          href="/buy"
          className={`mx-auto ${toggleSidebar ? 'px-2 py-0.5' : 'pl-3'} border-1 border-gray-300 rounded-full gap-x-3 flex items-center w-fit my-7`}
        >
          <div className="flex items-center justify-center">
            <TokensSVG color1="#f472b6" color2="#fb923c" id="pinkToOrange" />
            <span className="text-12">{user?.isLegacyUser ? '♾️' : user?.tokens}</span>
          </div>
          {!toggleSidebar && (
            <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-full h-7 flex items-center justify-center text-12 font-semibold text-white px-2 border-1 border-pink-500 hover:bg-gradient-to-r hover:from-zinc-500 hover:to-zinc-600 hover:border-zinc-500">
              {user?.isLegacyUser ? 'Subscription' : 'Upgrade'}
            </div>
          )}
        </Link>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setToggleSidebar(!toggleSidebar)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
        >
          <motion.div animate={{ rotate: toggleSidebar ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronRight className="w-3 h-3" />
          </motion.div>
        </motion.button>

        {/* Navigation Links */}
        <div className="pb-4">
          <nav className={`px-3 space-y-1 ${toggleSidebar ? 'flex flex-col items-center' : ''}`}>
            {linkData.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={link.linkKey}
                  onClick={(e) => (link.textKey === 'Logout' ? handleLogout(e) : {})}
                  className={`group flex items-center rounded-lg transition-all duration-200 ${
                    toggleSidebar ? 'w-10 h-10 justify-center p-2' : 'px-3 py-2.5 justify-between'
                  } ${
                    link.isActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-x-3">
                    <div className={`flex items-center justify-center ${toggleSidebar ? 'w-5 h-5' : 'w-5 h-5'}`}>
                      {isLoading && link.textKey === 'Logout' ? (
                        <Spinner fill="fill-white" track="text-gray-400" wAndH="w-4 h-4" />
                      ) : (
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                          <link.icon
                            className={`w-5 h-5 transition-colors duration-200 ${
                              link.isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                            }`}
                          />
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence>
                      {!toggleSidebar && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm font-medium whitespace-nowrap"
                        >
                          {link.textKey}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active indicator */}
                  <AnimatePresence>
                    {link.isActive && !toggleSidebar && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <AnimatePresence>
          {!toggleSidebar && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 cursor-pointer"
              onClick={() => setPetDropdownOpen(true)}
            >
              <motion.div
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-x-3 p-3 rounded-lg border border-gray-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white capitalize">{user?.email?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate capitalize">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.isSuperUser
                      ? 'Super Admin'
                      : user?.isAdmin
                        ? 'Admin'
                        : user?.isLegacyUser
                          ? 'Legacy User'
                          : user?.isComfortUser
                            ? 'Comfort User'
                            : 'Free User'}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Profile Indicator */}

        <AnimatePresence>
          {toggleSidebar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-4 flex justify-center"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center relative">
                <span className="text-sm font-semibold text-white">X</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default GuardianNavigation
