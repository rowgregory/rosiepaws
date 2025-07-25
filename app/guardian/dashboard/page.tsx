'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Spinner from '@/app/components/common/Spinner'
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
import GuardianMedicationGraph from '@/app/components/guardian/dashboard/GuardianMedicationGraph'
import LargeSeizureGraph from '@/app/components/guardian/dashboard/LargeSeizureGraph'
import LargeBloodSugarGraph from '@/app/components/guardian/dashboard/LargeBloodSugarGraph'
import {
  getDashboardNextAppointment,
  IProcessedChartData,
  metricConfigButton,
  metricsConfigCards,
  processChartData
} from '@/app/lib/utils'
import LargeAppointmentChart from '@/app/components/guardian/dashboard/LargeAppointmentChart'
import MiniAppointmentChart from '@/app/components/guardian/dashboard/MiniAppointmentChart'
import MiniWalkGraph from '@/app/components/guardian/dashboard/MiniWalkGraph'
import TokenCounter from '@/app/components/guardian/TokenCounter'
import { Activity, ArrowDown, ArrowLeftIcon, Heart, Plus, Utensils, X } from 'lucide-react'
import {
  setOpenAppointmentDrawer,
  setOpenBloodSugarDrawer,
  setOpenFeedingDrawer,
  setOpenMedicationDrawer,
  setOpenMovementDrawer,
  setOpenPainScoreDrawer,
  setOpenSeizureDrawer,
  setOpenWalkDrawer,
  setOpenWaterDrawer
} from '@/app/redux/features/petSlice'
import { useRouter } from 'next/navigation'
import LargeWalkGraph from '@/app/components/guardian/dashboard/LargeWalkGraph'
import { motion } from 'framer-motion'
import MiniMovementsGraph from '@/app/components/guardian/dashboard/MiniMovementGraph'
import LargeMovementsGraph from '@/app/components/guardian/dashboard/LargeMovementGraph'

const GuardianDashboard = () => {
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const {
    pet,
    loading,
    zeroFeedings,
    zeroPainScores,
    zeroWalks,
    zeroWaters,
    zeroMovements,
    zeroMedications,
    zeroAppointments,
    zeroBloodSugars,
    zeroSeizures
  } = useAppSelector((state: RootState) => state.pet)
  const [onboardingBanner, setOnboardingBanner] = useState(false)

  const noData =
    zeroFeedings &&
    zeroPainScores &&
    zeroWalks &&
    zeroWaters &&
    zeroMovements &&
    zeroMedications &&
    zeroAppointments &&
    zeroBloodSugars &&
    zeroSeizures

  useEffect(() => {
    if (noData) {
      setOnboardingBanner(true)
    }
  }, [noData])

  const chartData: IProcessedChartData = useMemo(() => processChartData(pet), [pet])

  // Calculate quick stats
  const stats = useMemo(() => {
    if (!pet || !chartData) return {}

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const { painScores, feedings, waters, walks, medications, movements, appointments, bloodSugars, seizures } =
      chartData

    const weekPain = painScores?.filter((item) => new Date(item.date) >= weekAgo) || []
    const weekFeeding = feedings?.filter((item) => new Date(item.date) >= weekAgo) || []
    const weekWater = waters?.filter((item) => new Date(item.date) >= weekAgo) || []
    const weekWalks = walks?.filter((item) => new Date(item.date) >= weekAgo) || []
    const weekMovements = movements?.filter((item) => new Date(item.date) >= weekAgo) || []
    const nextAppointment = getDashboardNextAppointment(appointments)
    const weekBloodSugars = bloodSugars?.filter((item) => new Date(item.date) >= weekAgo) || []
    const weekSeizures = seizures?.filter((item) => new Date(item.date) >= weekAgo) || []

    return {
      painScores: {
        mostRecent: painScores.length > 0 ? painScores[painScores.length - 1].score : 0, // Most recent record score
        average:
          weekPain.length > 0 ? Math.round(weekPain.reduce((sum, item) => sum + item.score, 0) / weekPain.length) : 0,
        trend:
          weekPain.length >= 2 ? (weekPain[weekPain.length - 1].score > weekPain[0].score ? 'up' : 'down') : 'stable',
        hasPainScores: (painScores?.length || 0) > 0,
        totalLogs: painScores?.length || 0
      },
      feedings: {
        mostRecent: feedings.length > 0 ? feedings[feedings.length - 1].foodAmount : 0,
        average:
          weekFeeding.length > 0
            ? Math.round(weekFeeding.reduce((sum, item) => sum + parseInt(item.foodAmount), 0) / weekFeeding.length)
            : 0,
        trend:
          weekFeeding.length >= 2
            ? weekFeeding[weekFeeding.length - 1].moodRating > weekFeeding[0].moodRating
              ? 'up'
              : 'down'
            : 'stable',
        hasFeedings: (feedings?.length || 0) > 0,
        totalLogs: feedings?.length || 0
      },
      waters: {
        mostRecent: waters.length > 0 ? waters[0].milliliters : 0,
        average:
          weekWater.length > 0
            ? Math.round(weekWater.reduce((sum, item) => sum + Number(item.milliliters || 0), 0) / weekWater.length)
            : 0,
        trend:
          weekWater.length >= 2
            ? weekWater[weekWater.length - 1].milliliters || 0 > weekWater[0].milliliters || 0
              ? 'up'
              : 'down'
            : 'stable',
        hasWaters: (waters?.length || 0) > 0,
        totalLogs: waters?.length || 0
      },
      walks: {
        mostRecent: walks.length > 0 ? walks[0].distance : 0,
        average:
          weekWalks.length > 0
            ? Math.round(weekWalks.reduce((sum, item) => sum + Number(item.distance || 0), 0) / weekWalks.length)
            : 0,
        trend: weekWalks.length >= 2 ? (weekWalks[weekWalks.length - 1].distance ? 'up' : 'down') : 'stable',
        hasWalks: (walks?.length || 0) > 0,
        totalLogs: walks?.length || 0
      },
      movements: {
        mostRecent: movements.length > 0 ? movements[0].durationMinutes : 0,
        average:
          weekMovements.length > 0
            ? Math.round(
                weekMovements.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0) / weekMovements.length
              )
            : 0,
        trend:
          weekMovements.length >= 2
            ? weekMovements[weekMovements.length - 1].durationMinutes
              ? 'up'
              : 'down'
            : 'stable',
        hasMovements: (movements?.length || 0) > 0,
        totalLogs: movements?.length || 0
      },
      medications: {
        mostRecent: medications.length > 0 ? medications?.[0]?.drugName : 0,
        hasMedications: (medications?.length || 0) > 0,
        totalLogs: medications?.length || 0,
        dosage: medications?.[0]?.dosage,
        dosageUnit: medications?.[0]?.dosageUnit
      },
      appointments: {
        mostRecent:
          appointments.length > 0
            ? nextAppointment.serviceType?.charAt(0).toUpperCase() + nextAppointment.serviceType?.slice(1).toLowerCase()
            : '--',
        average: 0,
        trend: '--',
        hasAppointments: (appointments?.length || 0) > 0,
        totalLogs: appointments?.length || 0,
        date: nextAppointment?.date,
        time: nextAppointment?.time
      },
      bloodSugars: {
        mostRecent: bloodSugars.length > 0 ? bloodSugars[0]?.value : 0,
        average:
          weekBloodSugars.length > 0
            ? Math.round(
                weekBloodSugars.reduce((sum, item) => sum + Number(item.value || 0), 0) / weekBloodSugars.length
              )
            : 0,
        trend:
          weekBloodSugars.length >= 2 ? (weekBloodSugars[weekBloodSugars.length - 1].value ? 'up' : 'down') : 'stable',
        hasBloodSugars: (bloodSugars?.length || 0) > 0 || false,
        totalLogs: bloodSugars?.length || 0
      },

      seizures: {
        mostRecent: seizures.length > 0 ? seizures[0]?.duration : 0,
        average:
          weekBloodSugars.length > 0 ? weekSeizures.reduce((sum, seizure) => sum + Number(seizure.duration), 0) : 0,
        trend: weekSeizures.length >= 2 ? (weekSeizures[weekSeizures.length - 1].duration ? 'up' : 'down') : 'stable',
        hasSeizures: (seizures?.length || 0) > 0 || false,
        totalLogs: seizures?.length || 0
      }
    }
  }, [pet, chartData])

  const renderChart = () => {
    switch (selectedMetric) {
      case 'blood-sugars':
        return <LargeBloodSugarGraph bloodSugarData={chartData?.bloodSugars} />
      case 'pain-scores':
        return <LargePainScoreGraph chartData={chartData?.painScores} />
      case 'feedings':
        return <LargeFeedingGraph feedingData={chartData.feedings} />
      case 'waters':
        return <LargeWaterGraph waterData={chartData.waters} petWeight={pet?.weight || 20} />
      case 'walks':
        return <LargeWalkGraph walks={chartData.walks} petWeight={pet?.weight || 20} />
      case 'appointments':
        return <LargeAppointmentChart appointments={chartData.appointments} />
      case 'medications':
        return <GuardianMedicationGraph medicationData={chartData.medications} />
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
            <MiniWalkGraph walks={chartData?.walks} />
            <MiniMovementsGraph movements={chartData?.movements} />
            <MiniMedicationChart medications={chartData?.medications} />
            <MiniAppointmentChart appointments={chartData.appointments} />
            <MiniBloodSugarGraph bloodSugars={chartData?.bloodSugars} />
            <MiniSeizureChart seizures={chartData.seizures} />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center pt-12">
        <Spinner fill="fill-indigo-500" track="text-white" wAndH="w-8 h-8" />
      </div>
    )
  }

  const handleMetricClick = (metric: any) => {
    // If clicking the same metric, go back to overview
    if (selectedMetric === metric.id) {
      setSelectedMetric('overview')
      return
    }

    // Handle metrics with no data - open drawer and navigate
    const noDataActions: Record<string, { drawer: any; route: string }> = {
      'pain-scores': { drawer: setOpenPainScoreDrawer(), route: '/guardian/pets/pain' },
      feedings: { drawer: setOpenFeedingDrawer(), route: '/guardian/pets/feedings' },
      waters: { drawer: setOpenWaterDrawer(), route: '/guardian/pets/water' },
      walks: { drawer: setOpenWalkDrawer(), route: '/guardian/pets/walks' },
      medications: { drawer: setOpenMedicationDrawer(), route: '/guardian/pets/medication' },
      movements: { drawer: setOpenMovementDrawer(), route: '/guardian/pets/movements' },
      appointments: { drawer: setOpenAppointmentDrawer(), route: '/guardian/pets/appointments' },
      'blood-sugars': { drawer: setOpenBloodSugarDrawer(), route: '/guardian/pets/blood-sugar' },
      seizures: { drawer: setOpenSeizureDrawer(), route: '/guardian/pets/seizure' }
    }

    const metricAction = noDataActions[metric.id]
    const hasData = [
      'pain-scores',
      'feedings',
      'waters',
      'walks',
      'medications',
      'movements',
      'appointments',
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
    <div className="bg-gray-50">
      <div className="sticky top-0 flex items-center pl-6 border-b-1 border-b-gray-300 z-30 bg-white h-24">
        <span className="text-2xl bg-gradient-to-r from-orange-400 via-orange-600 to-pink-600 bg-clip-text text-transparent font-semibold">
          {pet?.name}&apos;s Health Dashboard
        </span>
      </div>
      <div className="h-[calc(100dvh-96px)] mx-auto p-6 space-y-8">
        {onboardingBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-blue-500 rounded-full p-1">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Welcome to {pet.name}&apos;s Health Dashboard! 🎉
                  </h3>
                </div>

                <p className="text-gray-600 mb-4">
                  Start tracking {pet.name}&apos;s health by clicking on any of the metric cards below to add your first
                  data entry.
                </p>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Pain Scores</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-blue-200">
                    <Utensils className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Feedings</span>
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

              <button
                onClick={() => setOnboardingBanner(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
        <>
          <div className="flex gap-3.5 w-[calc(100vw-304px)] overflow-x-auto pb-2 scrollbar-hide">
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
          {!noData && (
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
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
                <div className="flex items-center gap-x-3">
                  {selectedMetric !== 'overview' && (
                    <button
                      onClick={() => {
                        const config = metricConfigButton[selectedMetric as keyof typeof metricConfigButton]
                        if (config) {
                          dispatch(config.action)
                        }
                      }}
                      className="inline-flex items-center gap-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200"
                    >
                      Log {metricConfigButton[selectedMetric as keyof typeof metricConfigButton]?.label || ''}
                      <TokenCounter
                        tokens={metricConfigButton[selectedMetric as keyof typeof metricConfigButton]?.tokens || 0}
                      />
                    </button>
                  )}
                  {selectedMetric !== 'overview' && (
                    <button
                      onClick={() => setSelectedMetric('overview')}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-x-1.5 ${
                        selectedMetric === 'overview'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {selectedMetric !== 'overview' && <ArrowLeftIcon size={16} />} Overview
                    </button>
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
