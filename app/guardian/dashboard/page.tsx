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
import GuardianMedicationGraph from '@/app/components/guardian/dashboard/GuardianMedicationGraph'
import LargeSeizureGraph from '@/app/components/guardian/dashboard/LargeSeizureGraph'
import LargeBloodSugarGraph from '@/app/components/guardian/dashboard/LargeBloodSugarGraph'
import LargeAppointmentChart from '@/app/components/guardian/dashboard/LargeAppointmentChart'
import MiniAppointmentChart from '@/app/components/guardian/dashboard/MiniAppointmentChart'
import MiniWalkGraph from '@/app/components/guardian/dashboard/MiniWalkGraph'
import TokenCounter from '@/app/components/guardian/TokenCounter'
import { Activity, ArrowDown, ArrowLeftIcon, ArrowRightIcon, Heart, Plus, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LargeWalkGraph from '@/app/components/guardian/dashboard/LargeWalkGraph'
import { motion } from 'framer-motion'
import MiniMovementsGraph from '@/app/components/guardian/dashboard/MiniMovementGraph'
import LargeMovementsGraph from '@/app/components/guardian/dashboard/LargeMovementGraph'
import { metricConfigButton, metricsConfigCards } from '@/app/lib/constants/public/dashboard/displayConstants'
import { setOpenPainScoreCreateDrawer } from '@/app/redux/features/painScoreSlice'
import Link from 'next/link'
import { setOpenFeedingCreateDrawer } from '@/app/redux/features/feedingSlice'
import { setOpenWaterCreateDrawer } from '@/app/redux/features/waterSlice'
import { setOpenWalkCreateDrawer } from '@/app/redux/features/walkSlice'
import { setOpenMedicationCreateDrawer } from '@/app/redux/features/medicationSlice'
import { setOpenMovementCreateDrawer } from '@/app/redux/features/movementSlice'
import { setOpenAppointmentCreateDrawer } from '@/app/redux/features/appointmentSlice'
import { setOpenBloodSugarCreateDrawer } from '@/app/redux/features/bloodSugarSlice'
import { setOpenSeizureCreateDrawer } from '@/app/redux/features/seizureSlice'
import { getTodaysBloodSugarLogs } from '@/app/lib/utils'

const GuardianDashboard = () => {
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const { pet, loading, chartData, stats, onboardingBanner, noLogs } = useAppSelector((state: RootState) => state.pet)

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
      case 'walks':
        return <LargeWalkGraph walks={chartData?.walks} petWeight={pet?.weight || 20} />
      case 'appointments':
        return <LargeAppointmentChart appointments={chartData?.appointments} />
      case 'medications':
        return <GuardianMedicationGraph medicationData={chartData?.medications} />
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

    // Handle metrics with no data - open drawer and navigate
    const noDataActions: Record<string, { drawer: any; route: string }> = {
      'pain-scores': { drawer: setOpenPainScoreCreateDrawer(), route: '/guardian/pets/pain' },
      feedings: { drawer: setOpenFeedingCreateDrawer(), route: '/guardian/pets/feedings' },
      waters: { drawer: setOpenWaterCreateDrawer(), route: '/guardian/pets/water' },
      walks: { drawer: setOpenWalkCreateDrawer(), route: '/guardian/pets/walks' },
      medications: { drawer: setOpenMedicationCreateDrawer(), route: '/guardian/pets/medication' },
      movements: { drawer: setOpenMovementCreateDrawer(), route: '/guardian/pets/movements' },
      appointments: { drawer: setOpenAppointmentCreateDrawer(), route: '/guardian/pets/appointments' },
      'blood-sugars': { drawer: setOpenBloodSugarCreateDrawer(), route: '/guardian/pets/blood-sugar' },
      seizures: { drawer: setOpenSeizureCreateDrawer(), route: '/guardian/pets/seizure' }
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
          {!noLogs && (
            <div
              className={`${!loading ? 'border-gray-100 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'} rounded-2xl p-8 shadow-md border`}
            >
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
                    <>
                      <button
                        onClick={() => {
                          const config = metricConfigButton[selectedMetric as keyof typeof metricConfigButton]

                          const todaysBloodSugars = getTodaysBloodSugarLogs(chartData.bloodSugars || [])
                          const todaysBloodSugarsCount = todaysBloodSugars?.length
                          const dailyLimit = 4
                          const remainingReadings = Math.max(0, dailyLimit - todaysBloodSugarsCount)
                          const canAddMore = remainingReadings > 0
                          if (config && canAddMore) {
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

                      <button
                        onClick={() => setSelectedMetric('overview')}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-x-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200`}
                      >
                        <ArrowLeftIcon size={16} /> Overview
                      </button>
                      <Link
                        href={
                          selectedMetric === 'blood-sugars'
                            ? '/guardian/pets/blood-sugar'
                            : selectedMetric === 'pain-score'
                              ? '/guardian/pets/pain'
                              : selectedMetric === 'feedings'
                                ? '/guardian/pets/feedings'
                                : selectedMetric === 'water'
                                  ? '/guardian/pets/water'
                                  : selectedMetric === 'medications'
                                    ? '/guardian/pets/medications'
                                    : selectedMetric === 'seizures'
                                      ? '/guardian/pets/seizures'
                                      : selectedMetric === 'movements'
                                        ? '/guardian/pets/movements'
                                        : selectedMetric === 'walks'
                                          ? '/guardian/pets/walks'
                                          : '/guardian/pets/appointments'
                        }
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-x-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200`}
                      >
                        View All{' '}
                        {selectedMetric === 'blood-sugars'
                          ? 'Blood Sugars'
                          : selectedMetric === 'pain-score'
                            ? 'Pain Scores'
                            : selectedMetric === 'feedings'
                              ? 'Feedings'
                              : selectedMetric === 'water'
                                ? 'Waters'
                                : selectedMetric === 'medications'
                                  ? 'Medications'
                                  : selectedMetric === 'seizures'
                                    ? 'Seizures'
                                    : selectedMetric === 'movements'
                                      ? 'Movements'
                                      : selectedMetric === 'walks'
                                        ? 'Walks'
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
