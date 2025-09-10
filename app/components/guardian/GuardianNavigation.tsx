'use client'

import React, { useState } from 'react'
import { RootState, useAppDispatch, useAppSelector, useUserSelector } from '@/app/redux/store'
import PetDropdownMenu from './navigation/PetDropdownMenu'
import { setOpenPetDrawer, setSelectedPetWithChartData } from '@/app/redux/features/petSlice'
import { processChartDataForPet } from '@/app/lib/utils/public/dashboard/processChartData'
import { calculatePetStats } from '@/app/lib/utils/public/dashboard/calculatePetStats'
import HeaderSecetion from '../navigation/HeaderSection'
import NavigationLinks from '../navigation/NavigationLinks'
import BottomProfileSection from './navigation/BottomProfileSection'
import Token from './navigation/Token'
import ToggleButton from '../navigation/ToggleButton'
import CollapsedProfileIndicator from '../navigation/CollapsedProfileIndicator'
import { publicDashboardLinks } from '@/app/lib/utils'
import useCustomPathname from '@/app/hooks/useCustomPathname'

const GuardianNavigation = () => {
  const dispatch = useAppDispatch()
  const { zeroPets, pet, pets, loading } = useAppSelector((state: RootState) => state.pet)
  const { user } = useUserSelector()
  const [petDropdownOpen, setPetDropdownOpen] = useState<boolean>(false)
  const { navigation } = useAppSelector((state: RootState) => state.app)
  const path = useCustomPathname()

  const handlePetSelect = (selectedPet: any) => {
    setPetDropdownOpen(false)
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

  const linkData = publicDashboardLinks(path, zeroPets)

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
      <div
        className={`${navigation ? 'w-16' : 'w-64'} hidden lg:block fixed top-0 left-0 min-h-screen bg-white border-r border-gray-200 z-20`}
      >
        {/* Header Section */}
        <HeaderSecetion toggleSidebar={navigation} user={user} title="Guardian" loading={loading} />

        {/* Token */}
        <Token toggleSidebar={navigation} user={user} loading={loading} />

        {/* Toggle Button */}
        <ToggleButton toggleSidebar={navigation} />

        {/* Navigation Links */}
        <NavigationLinks toggleSidebar={navigation} linkData={linkData} />

        {/* Bottom Profile Section */}
        <BottomProfileSection
          toggleSidebar={navigation}
          setPetDropdownOpen={setPetDropdownOpen}
          user={user}
          loading={loading}
        />

        {/* Collapsed Profile Indicator */}
        <CollapsedProfileIndicator
          toggleSidebar={navigation}
          setPetDropdownOpen={setPetDropdownOpen}
          initial={user?.email?.charAt(0) ?? ''}
        />
      </div>
    </>
  )
}

export default GuardianNavigation
