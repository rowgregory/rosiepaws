'use client'

import React, { useState } from 'react'
import { RootState, useAppDispatch, useAppSelector, useUserSelector } from '@/app/redux/store'
import PetDropdownMenu from './navigation/PetDropdownMenu'
import { setOpenPetDrawer, setSelectedPetWithChartData } from '@/app/redux/features/petSlice'
import { processChartDataForPet } from '@/app/lib/utils/public/dashboard/processChartData'
import { calculatePetStats } from '@/app/lib/utils/public/dashboard/calculatePetStats'
import { motion } from 'framer-motion'
import HeaderSecetion from './navigation/HeaderSecetion'
import NavigationLinks from './navigation/NavigationLinks'
import BottomProfileSection from './navigation/BottomProfileSection'
import Token from './navigation/Token'
import ToggleButton from './navigation/ToggleButton'
import CollapsedProfileIndicator from './navigation/CollapsedProfileIndicator'

const GuardianNavigation = () => {
  const dispatch = useAppDispatch()
  const { zeroPets, pet, pets } = useAppSelector((state: RootState) => state.pet)
  const { user } = useUserSelector()
  const [petDropdownOpen, setPetDropdownOpen] = useState<boolean>(false)
  const { navigation } = useAppSelector((state: RootState) => state.app)

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
        animate={{ width: navigation ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block fixed top-0 left-0 min-h-screen bg-white border-r border-gray-200 z-20"
      >
        {/* Header Section */}
        <HeaderSecetion toggleSidebar={navigation} user={user} />

        {/* Token */}
        <Token toggleSidebar={navigation} user={user} />

        {/* Toggle Button */}
        <ToggleButton toggleSidebar={navigation} />

        {/* Navigation Links */}
        <NavigationLinks zeroPets={zeroPets} toggleSidebar={navigation} />

        {/* Bottom Profile Section */}
        <BottomProfileSection toggleSidebar={navigation} setPetDropdownOpen={setPetDropdownOpen} user={user} />

        {/* Collapsed Profile Indicator */}
        <CollapsedProfileIndicator toggleSidebar={navigation} setPetDropdownOpen={setPetDropdownOpen} />
      </motion.div>
    </>
  )
}

export default GuardianNavigation
