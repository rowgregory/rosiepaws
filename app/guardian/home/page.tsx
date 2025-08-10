'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  Pill,
  Utensils,
  Activity,
  MapPin,
  Droplets,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Plus,
  FileText,
  RefreshCcw,
  Trash2,
  Hospital
} from 'lucide-react'
import MainActionCard from '@/app/components/guardian/home/MainActionCard'
import CareResourcesAndInfo from '@/app/components/guardian/home/CareResourcesAndInfo'
import SupportSection from '@/app/components/guardian/home/SupportSection'
import DisabilityEndOfLifeCareDrawer from '@/app/drawers/general/DisabilityEndOfLifeCareDrawer'
import CreateSupportDrawer from '@/app/drawers/general/ContactSupportDrawer'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import EmergencySignsDrawer from '@/app/drawers/general/EmergencySignsDrawer'
import ViewGuideDrawer from '@/app/drawers/general/ViewGuideDrawer'
import PetProfileSection from '@/app/components/guardian/home/PetProfileSection'
import TodaysProgressSection from '@/app/components/guardian/home/TodaysProgressSection'
import { setOpenPainDrawer } from '@/app/redux/features/painSlice'
import { setOpenFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { setOpenWaterDrawer } from '@/app/redux/features/waterSlice'
import { setOpenMovementDrawer } from '@/app/redux/features/movementSlice'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'

const Home = () => {
  const dispatch = useAppDispatch()
  const [currentTime] = useState(new Date())
  const { user } = useAppSelector((state: RootState) => state.user)
  const { zeroPets, pet, pets } = useAppSelector((state: RootState) => state.pet)
  const { tokenTransactions } = useAppSelector((state: RootState) => state.user)

  const thisWeeksFeedings = pet?.feedings?.filter(
    (f) => new Date(f.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const thisWeeksVitalSigns = pet?.vitalSigns?.filter(
    (w) => new Date(w.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const averageWaterIntake =
    pet?.waters?.length > 0
      ? pet?.waters?.reduce((acc, item) => acc + Number(item.milliliters), 0) / pet?.waters?.length
      : 0

  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  return (
    <>
      <EmergencySignsDrawer />
      <ViewGuideDrawer />
      <DisabilityEndOfLifeCareDrawer />
      <CreateSupportDrawer />
      <div className="min-h-dvh bg-gray-50">
        {zeroPets ? (
          <div className="px-6 py-5 max-w-7xl mx-auto min-h-dvh">
            <MainActionCard />
          </div>
        ) : (
          <div className="p-6 max-w-7xl mx-auto">
            {/* Professional Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                      Good {getTimeOfDay()}, {user?.firstName || 'Caregiver'}
                    </h1>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Metrics - 4 columns */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-4"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Weekly Summary</h2>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                          <Utensils className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Meals Logged</p>
                          <p className="text-xs text-gray-500">This week</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">{thisWeeksFeedings}</p>
                        <p className="text-xs text-gray-500">total</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Exercise Sessions</p>
                          <p className="text-xs text-gray-500">This week</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">{thisWeeksVitalSigns}</p>
                        <p className="text-xs text-gray-500">vital signs</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center mr-3">
                          <Droplets className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Water Intake</p>
                          <p className="text-xs text-gray-500">Daily average</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">{averageWaterIntake?.toFixed(0)}</p>
                        <p className="text-xs text-gray-500">mL</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Daily Progress - 5 columns */}

              <TodaysProgressSection
                waters={pet?.waters}
                feedings={pet?.feedings}
                painScores={pet?.painScores}
                pets={pets}
              />

              {/* Quick Actions - 3 columns */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>

                  <div className="space-y-3">
                    {[
                      {
                        label: 'Log Pain Score',
                        icon: <Heart className="w-5 h-5" />,
                        urgent: false,
                        func: setOpenPainDrawer
                      },
                      {
                        label: 'Log Feeding',
                        icon: <Utensils className="w-5 h-5" />,
                        urgent: false,
                        func: setOpenFeedingDrawer
                      },
                      {
                        label: 'Log Vital Signs',
                        icon: <Hospital className="w-5 h-5" />,
                        urgent: false,
                        func: setOpenVitalSignsDrawer
                      },
                      {
                        label: 'Log Water',
                        icon: <Droplets className="w-5 h-5" />,
                        urgent: false,
                        func: setOpenWaterDrawer
                      },
                      {
                        label: 'Log Movement',
                        icon: <MapPin className="w-5 h-5" />,
                        urgent: false,
                        func: user?.isFreeUser ? setOpenNeedToUpgradeDrawer : setOpenMovementDrawer
                      }
                    ].map((action) => (
                      <button
                        onClick={() => dispatch(action.func())}
                        key={action.label}
                        className={`w-full flex items-center p-3 rounded-lg border transition-colors duration-200 ${
                          action.urgent
                            ? 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${action.urgent ? 'bg-red-100' : 'bg-white'}`}>
                          {action.icon}
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Token Usage Activity - 7 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-7"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Token Activity</h2>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Current Balance: {user?.tokens?.toLocaleString()} tokens
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 max-h-[400px]">
                    <div className="space-y-3">
                      {tokenTransactions?.map((transaction) => {
                        const getIconForType = (type: string) => {
                          if (type.includes('PAIN_SCORE')) return <Heart className="w-4 h-4" />
                          if (type.includes('MOVEMENT')) return <MapPin className="w-4 h-4" />
                          if (type.includes('MEDICATION')) return <Pill className="w-4 h-4" />
                          if (type.includes('FEEDING')) return <Utensils className="w-4 h-4" />
                          if (type.includes('WATER')) return <Droplets className="w-4 h-4" />
                          if (type.includes('APPOINTMENT')) return <Calendar className="w-4 h-4" />
                          if (type.includes('BLOOD_SUGAR')) return <Activity className="w-4 h-4" />
                          if (type.includes('SEIZURE')) return <AlertTriangle className="w-4 h-4" />
                          if (type.includes('PET_CREATION')) return <Plus className="w-4 h-4" />
                          if (type.includes('PET_UPDATE')) return <RefreshCcw className="w-4 h-4" />
                          if (type.includes('DELETE')) return <Trash2 className="w-4 h-4" />
                          return <FileText className="w-4 h-4" />
                        }

                        const getColorForType = (type: string) => {
                          if (type.includes('PAIN_SCORE')) return 'bg-red-100 text-red-600'
                          if (type.includes('MOVEMENT')) return 'bg-green-100 text-green-600'
                          if (type.includes('MEDICATION')) return 'bg-purple-100 text-purple-600'
                          if (type.includes('FEEDING')) return 'bg-green-100 text-green-600'
                          if (type.includes('WATER')) return 'bg-blue-100 text-blue-600'
                          if (type.includes('APPOINTMENT')) return 'bg-violet-100 text-violet-600'
                          if (type.includes('BLOOD_SUGAR')) return 'bg-orange-100 text-orange-600'
                          if (type.includes('SEIZURE')) return 'bg-yellow-100 text-yellow-600'
                          return 'bg-pink-100 text-pink-600'
                        }

                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className={`p-2 rounded-lg mr-4 ${getColorForType(transaction.type)}`}>
                              {getIconForType(transaction.type)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span>{transaction.time}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{transaction.amount} tokens</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {transaction.type.toLowerCase().replace(/_/g, ' ')}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-end text-sm">
                      <div className="text-gray-500">Total: {user?.tokensUsed?.toLocaleString()} tokens used</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Pet Profile - 5 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-5"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
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
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <CareResourcesAndInfo />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
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
