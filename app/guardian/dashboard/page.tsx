'use client'

import React, { useState } from 'react'
import LargeFeedingGraph from '@/app/components/guardian/dashboard/LargeFeedingGraph'
import LargePainScoreGraph from '@/app/components/guardian/dashboard/LargePainScoreGraph'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import GuardianMetricCard from '@/app/components/guardian/dashboard/GuardianMetricCard'
import LargeWaterGraph from '@/app/components/guardian/dashboard/LargeWaterGraph'
import MiniWaterChart from '@/app/components/guardian/dashboard/MiniWaterChart'
import MiniSeizureChart from '@/app/components/guardian/dashboard/MiniSeizureChart'
import MiniMedicationChart from '@/app/components/guardian/dashboard/MiniMedicationChart'
import MiniBloodSugarGraph from '@/app/components/guardian/dashboard/MiniBloodSugarGraph'
import MiniPainScoreGraph from '@/app/components/guardian/dashboard/MiniPainScoreGraph'
import MiniFeedingGraph from '@/app/components/guardian/dashboard/MiniFeedingGraph'
import LargeMedicationGraph from '@/app/components/guardian/dashboard/LargeMedicationGraph'
import LargeSeizureGraph from '@/app/components/guardian/dashboard/LargeSeizureGraph'
import LargeBloodSugarGraph from '@/app/components/guardian/dashboard/LargeBloodSugarGraph'
import LargeAppointmentChart from '@/app/components/guardian/dashboard/LargeAppointmentChart'
import MiniAppointmentChart from '@/app/components/guardian/dashboard/MiniAppointmentChart'
import { Activity, ArrowDown, ArrowLeftIcon, ArrowRightIcon, Droplets, Heart, Plus, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LargeVitalSignsGraph from '@/app/components/guardian/dashboard/LargeVitalSignsGraph'
import { motion } from 'framer-motion'
import MiniMovementsGraph from '@/app/components/guardian/dashboard/MiniMovementGraph'
import LargeMovementsGraph from '@/app/components/guardian/dashboard/LargeMovementGraph'
import { metricsConfigCards } from '@/app/lib/constants/public/dashboard/displayConstants'
import { setOpenPainDrawer } from '@/app/redux/features/painSlice'
import Link from 'next/link'
import { setOpenFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { setOpenWaterDrawer } from '@/app/redux/features/waterSlice'
import { setOpenMedicationDrawer } from '@/app/redux/features/medicationSlice'
import { setOpenMovementDrawer } from '@/app/redux/features/movementSlice'
import { setOpenAppointmentDrawer } from '@/app/redux/features/appointmentSlice'
import { setOpenBloodSugarDrawer } from '@/app/redux/features/bloodSugarSlice'
import { setOpenSeizureDrawer } from '@/app/redux/features/seizureSlice'
import { setOpenVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'
import MiniVitalSignsGraph from '@/app/components/guardian/dashboard/MiniVitalSignsGraph'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenNotEnoughTokensModal } from '@/app/redux/features/appSlice'
import GuardianActionMenuButton from '@/app/components/guardian/GuardianActionMenuButton'

const GuardianDashboard = () => {
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const { pet, loading, chartData, stats, onboardingBanner, noLogs } = useAppSelector((state: RootState) => state.pet)
  const { user } = useAppSelector((state: RootState) => state.user)

  const renderChart = () => {
    switch (selectedMetric) {
      case 'blood-sugars':
        return <LargeBloodSugarGraph bloodSugarData={chartData.bloodSugars} />
      case 'pain-scores':
        return <LargePainScoreGraph chartData={chartData?.painScores} />
      case 'feedings':
        return <LargeFeedingGraph feedingData={chartData?.feedings} />
      case 'waters':
        return <LargeWaterGraph waterData={chartData?.waters} petWeight={pet?.weight || 20} />
      case 'vital-signs':
        return <LargeVitalSignsGraph vitalSigns={chartData?.vitalSigns} pet={pet} />
      case 'appointments':
        return <LargeAppointmentChart appointments={chartData?.appointments} />
      case 'medications':
        return <LargeMedicationGraph medicationData={chartData?.medications} />
      case 'seizures':
        return <LargeSeizureGraph seizures={chartData?.seizures} />
      case 'movements':
        return <LargeMovementsGraph movements={chartData?.movements} />

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MiniPainScoreGraph painScores={chartData?.painScores} />
            <MiniFeedingGraph feedings={chartData?.feedings} />
            <MiniWaterChart waters={chartData?.waters} />
            <MiniVitalSignsGraph vitalSigns={chartData?.vitalSigns} />
            <MiniMovementsGraph movements={chartData?.movements} />
            <MiniMedicationChart medications={chartData?.medications} />
            <MiniAppointmentChart appointments={chartData?.appointments} />
            <MiniBloodSugarGraph bloodSugars={chartData?.bloodSugars} />
            <MiniSeizureChart seizures={chartData?.seizures} />
          </div>
        )
    }
  }

  const handleMetricClick = (metric: any) => {
    // If clicking the same metric, go back to overview
    if (selectedMetric === metric.id) {
      setSelectedMetric('overview')
      return
    }

    // Define tier access levels
    const tierAccess: Record<string, Array<{ id: string; tokenCost: number }>> = {
      free: [
        { id: 'pain-scores', tokenCost: 75 },
        { id: 'feedings', tokenCost: 85 },
        { id: 'waters', tokenCost: 90 }
      ],
      comfort: [
        { id: 'pain-scores', tokenCost: 75 },
        { id: 'feedings', tokenCost: 85 },
        { id: 'waters', tokenCost: 90 },
        { id: 'vital-signs', tokenCost: 125 },
        { id: 'movements', tokenCost: 275 },
        { id: 'appointments', tokenCost: 300 }
      ],
      legacy: [
        { id: 'pain-scores', tokenCost: 75 },
        { id: 'feedings', tokenCost: 85 },
        { id: 'waters', tokenCost: 90 },
        { id: 'vital-signs', tokenCost: 125 },
        { id: 'movements', tokenCost: 275 },
        { id: 'appointments', tokenCost: 300 },
        { id: 'medications', tokenCost: 350 },
        { id: 'blood-sugars', tokenCost: 400 },
        { id: 'seizures', tokenCost: 500 }
      ]
    }

    // Check if user has access to this metric
    const userTier = user?.role?.toLowerCase() || 'free'
    const allowedMetrics = tierAccess[userTier] || tierAccess.free
    const metricAccess = allowedMetrics.find((m) => m.id === metric.id)

    // Check tier access first
    if (!metricAccess) {
      dispatch(setOpenNeedToUpgradeDrawer())
      return
    }

    // Check if user has enough tokens
    const userTokens = user?.tokens || 0
    const requiredTokens = metricAccess.tokenCost

    if (userTokens < requiredTokens && !metric.hasLogs) {
      dispatch(setOpenNotEnoughTokensModal(requiredTokens))
      return
    }

    // Handle metrics with no data - open drawer and navigate
    const noDataActions: Record<string, { drawer: any; route: string }> = {
      'pain-scores': { drawer: setOpenPainDrawer(), route: '/guardian/pets/pain' },
      feedings: { drawer: setOpenFeedingDrawer(), route: '/guardian/pets/feedings' },
      waters: { drawer: setOpenWaterDrawer(), route: '/guardian/pets/water' },
      'vital-signs': { drawer: setOpenVitalSignsDrawer(), route: '/guardian/pets/vital-signs' },
      movements: { drawer: setOpenMovementDrawer(), route: '/guardian/pets/movements' },
      appointments: { drawer: setOpenAppointmentDrawer(), route: '/guardian/pets/appointments' },
      medications: { drawer: setOpenMedicationDrawer(), route: '/guardian/pets/medication' },
      'blood-sugars': { drawer: setOpenBloodSugarDrawer(), route: '/guardian/pets/blood-sugar' },
      seizures: { drawer: setOpenSeizureDrawer(), route: '/guardian/pets/seizure' }
    }

    const metricAction = noDataActions[metric.id]

    const hasData = [
      'pain-scores',
      'feedings',
      'waters',
      'vital-signs',
      'movements',
      'appointments',
      'medications',
      'blood-sugars',
      'seizures'
    ].includes(metric.id)
      ? metric.hasLogs
      : false

    if (metricAction && !hasData) {
      dispatch(metricAction.drawer)
      push(metricAction.route)
    } else {
      setSelectedMetric(metric.id)
    }
  }

  return (
    <div>
      <div className="sticky top-0 flex items-center gap-x-4 pl-6 border-b-1 border-b-gray-100 z-30 bg-white h-[64px]">
        <GuardianActionMenuButton />
        <span className="text-xl lg:text-2xl font-semibold">{pet?.name}&apos;s Dashboard</span>
      </div>
      <div className="min-h-[calc(100dvh-64px)] mx-auto py-6 lg:p-6 space-y-8 bg-gray-50">
        {onboardingBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 lg:p-6 mb-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-blue-500 rounded-full p-1">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Welcome to {pet.name}&apos;s Health Dashboard!
                  </h3>
                </div>

                <p className="text-gray-600 mb-4">
                  Start tracking {pet.name}&apos;s health by clicking on any of the metric cards below to add your first
                  data entry.
                </p>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
                    <Activity className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-700">Pain Scores</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
                    <Utensils className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Feedings</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-700">Water Intakes</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
                    <Plus className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">And more...</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-blue-500"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </motion.div>
                  <span className="text-sm font-medium text-blue-600">
                    Click any grayed-out card below to get started
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <>
          <div className="flex gap-3.5 lg:w-[calc(100vw-304px)] overflow-x-auto py-2 scrollbar-hide">
            {metricsConfigCards(stats).map((metric, index) => {
              return (
                <motion.div
                  key={metric.id}
                  className="flex-shrink-0 w-[133px] h-[158px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: 'easeOut'
                  }}
                >
                  <GuardianMetricCard
                    key={metric.id}
                    title={metric.title}
                    value={metric.value}
                    subtitle={metric.subtitle}
                    icon={metric.icon}
                    color={metric.color}
                    trend={metric.trend}
                    onClick={() => handleMetricClick(metric)}
                    isActive={selectedMetric === metric.id}
                    id={metric.id}
                    hasLogs={metric.hasLogs}
                  />
                </motion.div>
              )
            })}
          </div>
          {!noLogs && (
            <div
              className={`${!loading ? 'border-gray-100 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'} lg:rounded-2xl lg:px-6 py-4 lg:p-8 shadow-md border`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="px-3 lg:px-0">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedMetric === 'blood-sugar'
                      ? 'Blood Sugar Monitoring'
                      : selectedMetric === 'pain-score'
                        ? 'Pain Score Tracking'
                        : selectedMetric === 'feedings'
                          ? 'Feeding History'
                          : selectedMetric === 'water'
                            ? 'Water Intake Logs'
                            : selectedMetric === 'medications'
                              ? 'Medication Schedule'
                              : selectedMetric === 'seizures'
                                ? 'Seizure Events'
                                : 'Health Overview'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedMetric === 'overview'
                      ? 'Quick overview of all health metrics'
                      : `Detailed ${selectedMetric.replace('-', ' ')} data and trends`}
                  </p>
                </div>
                <div className="flex items-center gap-x-3 mt-4 lg:mt-0 px-3">
                  {selectedMetric !== 'overview' && (
                    <>
                      <button
                        onClick={() => setSelectedMetric('overview')}
                        className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-x-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200`}
                      >
                        <ArrowLeftIcon size={16} /> Overview
                      </button>
                      <Link
                        href={
                          selectedMetric === 'blood-sugars'
                            ? '/guardian/pets/blood-sugar'
                            : selectedMetric === 'pain-scores'
                              ? '/guardian/pets/pain'
                              : selectedMetric === 'feedings'
                                ? '/guardian/pets/feedings'
                                : selectedMetric === 'waters'
                                  ? '/guardian/pets/water'
                                  : selectedMetric === 'medications'
                                    ? '/guardian/pets/medication'
                                    : selectedMetric === 'seizures'
                                      ? '/guardian/pets/seizures'
                                      : selectedMetric === 'movements'
                                        ? '/guardian/pets/movements'
                                        : selectedMetric === 'vital-signs'
                                          ? '/guardian/pets/vital-signs'
                                          : '/guardian/pets/appointments'
                        }
                        className={`flex-1  whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-x-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200`}
                      >
                        <span className="hidden lg:block">View All</span>
                        {selectedMetric === 'blood-sugars'
                          ? 'Blood Sugars'
                          : selectedMetric === 'pain-scores'
                            ? 'Pain Scores'
                            : selectedMetric === 'feedings'
                              ? 'Feedings'
                              : selectedMetric === 'waters'
                                ? 'Waters'
                                : selectedMetric === 'medications'
                                  ? 'Medications'
                                  : selectedMetric === 'seizures'
                                    ? 'Seizures'
                                    : selectedMetric === 'movements'
                                      ? 'Movements'
                                      : selectedMetric === 'vital-signs'
                                        ? 'Vital Signs'
                                        : 'Appointments'}{' '}
                        <ArrowRightIcon size={16} />
                      </Link>
                    </>
                  )}
                </div>
              </div>
              {renderChart()}
            </div>
          )}
        </>
      </div>
    </div>
  )
}

export default GuardianDashboard
