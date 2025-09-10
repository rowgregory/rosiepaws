'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainActionCard from '@/app/components/guardian/home/MainActionCard'
import CareResourcesAndInfo from '@/app/components/guardian/home/CareResourcesAndInfo'
import SupportSection from '@/app/components/guardian/home/SupportSection'
import DisabilityEndOfLifeCareDrawer from '@/app/drawers/general/DisabilityEndOfLifeCareDrawer'
import CreateSupportDrawer from '@/app/drawers/general/ContactSupportDrawer'
import { usePetSelector, useUserSelector } from '@/app/redux/store'
import EmergencySignsDrawer from '@/app/drawers/general/EmergencySignsDrawer'
import ViewGuideDrawer from '@/app/drawers/general/ViewGuideDrawer'
import PetProfileSection from '@/app/components/guardian/home/PetProfileSection'
import TodaysProgressSection from '@/app/components/guardian/home/TodaysProgressSection'

import FirstPetModal from '@/app/modals/FirstPetModal'
import TokenUsageActivity from '@/app/components/guardian/home/TokenUsageActivity'
import QuickActions from '@/app/components/guardian/home/QuickActions'
import WeeklyMetrics from '@/app/components/guardian/home/WeeklyMetrics'
import GuardianActionMenuButton from '@/app/components/guardian/GuardianActionMenuButton'

const Home = () => {
  const [currentTime] = useState(new Date())
  const { user, tokenTransactions } = useUserSelector()
  const { zeroPets, pet, pets, loading } = usePetSelector()

  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  return (
    <>
      <FirstPetModal />
      <EmergencySignsDrawer />
      <ViewGuideDrawer />
      <DisabilityEndOfLifeCareDrawer />
      <CreateSupportDrawer />
      <div className="min-h-dvh bg-gray-50">
        {loading ? (
          <div className="w-full flex items-center justify-center py-8">
            <div className="border-2 border-pink-500 border-t-0 rounded-full animate-spin w-8 h-8" />
          </div>
        ) : zeroPets ? (
          <div className="px-6 py-5 max-w-7xl mx-auto min-h-dvh">
            <MainActionCard />
          </div>
        ) : (
          <div className="lg:p-6 max-w-7xl mx-auto">
            {/* Professional Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="bg-white flex items-center gap-x-4 lg:rounded-lg shadow-sm border border-gray-200 p-6">
                <GuardianActionMenuButton />
                <h1 className="text-xl lg:text-3xl font-semibold text-gray-900">
                  Good {getTimeOfDay()}, {user?.firstName || 'Caregiver'}
                </h1>
              </div>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Metrics - 4 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-4"
              >
                <WeeklyMetrics pet={pet} />
              </motion.div>

              {/* Daily Progress - 5 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-5"
              >
                <TodaysProgressSection
                  waters={pet?.waters}
                  feedings={pet?.feedings}
                  painScores={pet?.painScores}
                  pets={pets}
                />
              </motion.div>

              {/* Quick Actions - 3 columns */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
              >
                <QuickActions user={user} />
              </motion.div>

              {/* Token Usage Activity - 7 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-7"
              >
                <TokenUsageActivity user={user} tokenTransactions={tokenTransactions} />
              </motion.div>

              {/* Pet Profile - 5 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-5"
              >
                <div className="bg-white lg:rounded-lg lg:shadow-sm border border-t-gray-200 border-b-gray-200 lg:border-gray-200 p-4 lg:p-6 h-full">
                  <PetProfileSection pet={pets[0]} />
                </div>
              </motion.div>
            </div>

            {/* Bottom Sections */}
            <div className="mt-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white lg:rounded-lg lg:shadow-sm border border-t-gray-200 border-b-gray-200 lg:border-gray-200 p-4 lg:p-6"
              >
                <CareResourcesAndInfo />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white lg:rounded-lg lg:shadow-sm border border-t-gray-200 border-b-gray-200 lg:border-gray-200 p-4 lg:p-6"
              >
                <SupportSection />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Home
