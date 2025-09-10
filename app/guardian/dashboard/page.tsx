'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, usePetSelector, useUserSelector } from '@/app/redux/store'
import MetricCard from '@/app/components/guardian/dashboard/MetricCard'
import LargeFeedingGraph from '@/app/components/guardian/dashboard/graphs/large/LargeFeedingGraph'
import LargePainScoreGraph from '@/app/components/guardian/dashboard/graphs/large/LargePainScoreGraph'
import LargeWaterGraph from '@/app/components/guardian/dashboard/graphs/large/LargeWaterGraph'
import LargeMedicationGraph from '@/app/components/guardian/dashboard/graphs/large/LargeMedicationGraph'
import LargeSeizureGraph from '@/app/components/guardian/dashboard/graphs/large/LargeSeizureGraph'
import LargeBloodSugarGraph from '@/app/components/guardian/dashboard/graphs/large/LargeBloodSugarGraph'
import LargeAppointmentGraph from '@/app/components/guardian/dashboard/graphs/large/LargeAppointmentGraph'
import LargeMovementsGraph from '@/app/components/guardian/dashboard/graphs/large/LargeMovementGraph'
import LargeVitalSignsGraph from '@/app/components/guardian/dashboard/graphs/large/LargeVitalSignsGraph'
import MiniWaterGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniWaterGraph'
import MiniSeizureGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniSeizureGraph'
import MiniMedicationGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniMedicationGraph'
import MiniBloodSugarGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniBloodSugarGraph'
import MiniPainScoreGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniPainScoreGraph'
import MiniFeedingGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniFeedingGraph'
import MiniAppointmentGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniAppointmentGraph'
import MiniMovementsGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniMovementGraph'
import MiniVitalSignsGraph from '@/app/components/guardian/dashboard/graphs/mini/MiniVitalSignsGraph'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { metricsConfigCards } from '@/app/lib/constants/public/dashboard/displayConstants'
import { setOpenPainDrawer } from '@/app/redux/features/painSlice'
import { setOpenFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { setOpenWaterDrawer } from '@/app/redux/features/waterSlice'
import { setOpenMedicationDrawer } from '@/app/redux/features/medicationSlice'
import { setOpenMovementDrawer } from '@/app/redux/features/movementSlice'
import { setOpenAppointmentDrawer } from '@/app/redux/features/appointmentSlice'
import { setOpenBloodSugarDrawer } from '@/app/redux/features/bloodSugarSlice'
import { setOpenSeizureDrawer } from '@/app/redux/features/seizureSlice'
import { setOpenVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenNotEnoughTokensModal } from '@/app/redux/features/appSlice'
import GuardianActionMenuButton from '@/app/components/guardian/GuardianActionMenuButton'
import OnboardingBanner from '@/app/components/guardian/dashboard/OnboardingBanner'

interface MetricConfig {
  title: string
  urlPath: string
  buttonLabel: string
}

const METRIC_CONFIG: Record<string, MetricConfig> = {
  'blood-sugar': {
    title: 'Blood Sugar Monitoring',
    urlPath: 'blood-sugar',
    buttonLabel: 'Blood Sugars'
  },
  'pain-score': {
    title: 'Pain Score Tracking',
    urlPath: 'pain',
    buttonLabel: 'Pain Scores'
  },
  feedings: {
    title: 'Feeding History',
    urlPath: 'feedings',
    buttonLabel: 'Feedings'
  },
  water: {
    title: 'Water Intake Logs',
    urlPath: 'water',
    buttonLabel: 'Waters'
  },
  medications: {
    title: 'Medication Schedule',
    urlPath: 'medication',
    buttonLabel: 'Medications'
  },
  seizures: {
    title: 'Seizure Events',
    urlPath: 'seizures',
    buttonLabel: 'Seizures'
  },
  movements: {
    title: 'Movement Tracking',
    urlPath: 'movements',
    buttonLabel: 'Movements'
  },
  'vital-signs': {
    title: 'Vital Signs Monitoring',
    urlPath: 'vital-signs',
    buttonLabel: 'Vital Signs'
  },
  appointments: {
    title: 'Appointment History',
    urlPath: 'appointments',
    buttonLabel: 'Appointments'
  },
  overview: {
    title: 'Health Overview',
    urlPath: '',
    buttonLabel: 'Overview'
  }
}

// Helper functions
const getMetricTitle = (metric: string): string => {
  return METRIC_CONFIG[metric]?.title || 'Health Overview'
}

const getMetricDescription = (metric: string): string => {
  if (metric === 'overview') {
    return 'Quick overview of all health metrics'
  }
  return `Detailed ${metric.replace('-', ' ')} data and trends`
}

const getMetricUrl = (metric: string): string => {
  const config = METRIC_CONFIG[metric]
  return config?.urlPath ? `/guardian/pets/${config.urlPath}` : '/guardian/pets'
}

const getMetricButtonLabel = (metric: string): string => {
  return METRIC_CONFIG[metric]?.buttonLabel || 'Data'
}

const GuardianDashboard = () => {
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const { pet, loading, chartData, stats, onboardingBanner, noLogs } = usePetSelector()
  const { user } = useUserSelector()

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
        return <LargeAppointmentGraph appointments={chartData?.appointments} />
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
            <MiniWaterGraph waters={chartData?.waters} />
            <MiniVitalSignsGraph vitalSigns={chartData?.vitalSigns} />
            <MiniMovementsGraph movements={chartData?.movements} />
            <MiniMedicationGraph medications={chartData?.medications} />
            <MiniAppointmentGraph appointments={chartData?.appointments} />
            <MiniBloodSugarGraph bloodSugars={chartData?.bloodSugars} />
            <MiniSeizureGraph seizures={chartData?.seizures} />
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
        {onboardingBanner && <OnboardingBanner pet={pet} />}
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
                  <MetricCard
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
                  <h2 className="text-2xl font-bold text-gray-900">{getMetricTitle(selectedMetric)}</h2>
                  <p className="text-gray-600 mt-1">{getMetricDescription(selectedMetric)}</p>
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
                        href={getMetricUrl(selectedMetric)}
                        className={`flex-1  whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-x-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200`}
                      >
                        <span className="hidden lg:block">View All</span>
                        {getMetricButtonLabel(selectedMetric)}
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
