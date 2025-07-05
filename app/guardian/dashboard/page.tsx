'use client'

import React, { useState, useMemo } from 'react'
import { Activity, Droplets, Utensils, Pill, Zap, PawPrint, Heart, Plus } from 'lucide-react'
import Title from '@/app/components/admin/Title'
import Spinner from '@/app/components/common/Spinner'
import GuardianFeedingGraph from '@/app/components/guardian/GuardianFeedingGraph'
import GuardianPainScoreGraph from '@/app/components/guardian/GuardianPainScoreGraph'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import GuardianMetricCard from '@/app/components/guardian/GuardianMetricCard'
import GuardianWaterGraph from '@/app/components/guardian/GuardianWaterGraph'
import MiniWaterChart from '@/app/components/guardian/MiniGuardianWaterChart'
import MiniSeizureChart from '@/app/components/guardian/MiniGuardianSeizureChart'
import MiniGuardianMedicationChart from '@/app/components/guardian/MiniGuardianMedicationChart'
import MiniGuardianBloodSugarGraph from '@/app/components/guardian/MiniGuardianBloodSugarGraph'
import MiniGuardianPainChart from '@/app/components/guardian/MiniGuardianPainChart'
import MiniGuardianFeedingChart from '@/app/components/guardian/MiniGuardianFeedingChart'
import GuardianMedicationGraph from '@/app/components/guardian/GuardianMedicationGraph'
import GuardianSeizureGraph from '@/app/components/guardian/GuardianSeizureGraph'
import GuardianBloodSugarGraph from '@/app/components/guardian/GuardianBloodSugarGraph'
import { motion } from 'framer-motion'
import { setOpenPetDrawer } from '@/app/redux/features/petSlice'

const GuardianDashboard = () => {
  const dispatch = useAppDispatch()
  const { pet, loading, zeroPets } = useAppSelector((state: RootState) => state.pet)
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [expandedCards, setExpandedCards] = useState<string[]>(['overview'])

  // Process chart data
  const chartData = useMemo(() => {
    if (!pet) return {}

    return {
      painScores:
        pet?.painScores?.map((obj: any) => ({
          date: new Date(obj.createdAt).toLocaleDateString(),
          time: new Date(obj.createdAt).toLocaleTimeString(),
          score: obj.score,
          notes: obj.notes
        })) || [],

      bloodSugar:
        pet?.bloodSugars?.map((obj: any) => ({
          date: new Date(obj.timeTaken).toLocaleDateString(),
          time: new Date(obj.timeTaken).toLocaleTimeString(),
          value: parseInt(obj.value),
          status: obj.value < 80 ? 'low' : obj.value > 180 ? 'high' : obj.value > 120 ? 'elevated' : 'normal'
        })) || [],

      feedings:
        pet?.feedings?.map((obj: any) => ({
          date: new Date(obj.timeFed).toLocaleDateString(),
          time: new Date(obj.timeFed).toLocaleTimeString([], {
            timeStyle: 'short'
          }),
          amount: obj.foodAmount,
          type: obj.foodType
        })) || [],

      waters:
        pet?.waters?.map((obj: any) => ({
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString(),
          intakeType: obj.intakeType,
          milliliters: obj.milliliters,
          relativeIntake: obj.relativeIntake,
          timeRecorded: obj.timeRecorded,
          moodRating: obj.moodRating
        })) || [],

      medications:
        pet?.medications?.map((obj: any) => ({
          date: new Date(obj.timeTaken).toLocaleDateString(),
          time: new Date(obj.timeTaken).toLocaleTimeString(),
          drugName: obj.drugName,
          dosage: obj.dosage,
          dosageUnit: obj.dosageUnit,
          reminderEnabled: obj.reminderEnabled,
          frequency: obj.frequency,
          sentRemindersToday: obj.sentRemindersToday
        })) || [],

      seizures:
        pet?.seizures?.map((obj: any) => ({
          date: new Date(obj.timeTaken).toLocaleDateString(),
          time: new Date(obj.timeTaken).toLocaleTimeString(),
          duration: obj.duration
        })) || []
    }
  }, [pet])

  // Calculate quick stats
  const stats = useMemo(() => {
    if (!pet || !chartData) return {}

    const now = new Date()
    const today = now.toLocaleDateString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Filter data for today and this week
    const todayBloodSugar = chartData.bloodSugar?.filter((item) => item.date === today) || []
    const weekBloodSugar = chartData.bloodSugar?.filter((item) => new Date(item.date) >= weekAgo) || []

    const todayPain = chartData.painScores?.filter((item) => item.date === today) || []
    const weekPain = chartData.painScores?.filter((item) => new Date(item.date) >= weekAgo) || []

    const todayMedications = chartData.medications?.length || 0
    const todayMedicationReminders = chartData.medications?.filter((item) => item.reminderEnabled)
    const todayWater = chartData.waters?.filter((item) => item.date === today) || []
    const todayFeedings = chartData.feedings?.filter((item) => item.date === today) || []

    return {
      bloodSugar: {
        latest: todayBloodSugar[todayBloodSugar.length - 1]?.value || 0,
        average:
          weekBloodSugar.length > 0
            ? Math.round(weekBloodSugar.reduce((sum, item) => sum + item.value, 0) / weekBloodSugar.length)
            : 0,
        todayCount: todayBloodSugar.length,
        trend:
          todayBloodSugar.length >= 2
            ? todayBloodSugar[todayBloodSugar.length - 1].value > todayBloodSugar[todayBloodSugar.length - 2].value
              ? 'up'
              : 'down'
            : 'stable'
      },
      painScore: {
        latest: todayPain[0]?.score || 0,
        average:
          weekPain.length > 0 ? Math.round(weekPain.reduce((sum, item) => sum + item.score, 0) / weekPain.length) : 0,
        trend:
          weekPain.length >= 2 ? (weekPain[weekPain.length - 1].score > weekPain[0].score ? 'up' : 'down') : 'stable'
      },
      medications: {
        todayTotal: todayMedications,
        totalReminders: todayMedicationReminders?.length
      },
      water: {
        todayTotal: todayWater.reduce((sum, item) => {
          const milliliters = parseInt(item.milliliters) || 0
          return sum + milliliters
        }, 0),
        todayCount: todayWater.length
      },
      feedings: {
        todayCount: todayFeedings.length,
        lastMeal: todayFeedings[todayFeedings.length - 1]?.time || 'None today'
      },
      seizures: {
        thisWeek: chartData.seizures?.filter((item: any) => new Date(item.date) >= weekAgo).length || 0,
        lastSeizure: chartData.seizures?.[chartData.seizures.length - 1]?.date || 'None recorded'
      }
    }
  }, [pet, chartData])

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const renderChart = () => {
    switch (selectedMetric) {
      case 'blood-sugar':
        return <GuardianBloodSugarGraph bloodSugarData={chartData?.bloodSugar} />

      case 'pain-score':
        return <GuardianPainScoreGraph chartData={chartData.painScores} />
      case 'feedings':
        return <GuardianFeedingGraph feedingData={chartData.feedings} />
      case 'water':
        return <GuardianWaterGraph waterData={chartData.waters} petWeight={pet?.weight || 20} />
      case 'medications':
        return <GuardianMedicationGraph medicationData={chartData.medications} />
      case 'seizures':
        return <GuardianSeizureGraph seizureData={chartData?.seizures} />

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MiniGuardianPainChart chartData={chartData} />
            <MiniGuardianFeedingChart chartData={chartData} />
            <MiniWaterChart waterData={chartData.waters || []} />
            <MiniGuardianMedicationChart medications={chartData.medications} />
            <MiniGuardianBloodSugarGraph chartData={chartData} />
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

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-full mx-auto space-y-8">
        {/* Empty State */}
        {zeroPets ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pets yet</h3>
            <p className="text-gray-500 mb-6">Pets will appear here once you start tracking.</p>
            <motion.button
              onClick={() => dispatch(setOpenPetDrawer())}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Pet</span>
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <PawPrint className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Title title={`${pet?.name}'s Health Dashboard`} />
                  <p className="text-gray-600 mt-1">
                    {pet?.breed} • Last updated {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <GuardianMetricCard
                id="pain-score"
                title="Pain Level"
                value={`${stats.painScore?.latest ?? 'No data'}/10`}
                subtitle={`Weekly avg: ${stats.painScore?.average || 0}/10`}
                icon={Activity}
                color="orange"
                trend={stats.painScore?.trend}
                onClick={() => setSelectedMetric('pain-score')}
                isActive={selectedMetric === 'pain-score'}
                expandedCards={expandedCards}
                toggleCard={toggleCard}
              />

              <GuardianMetricCard
                id="feedings"
                title="Feedings"
                value={stats.feedings?.todayCount || 0}
                subtitle={`Last meal: ${stats.feedings?.lastMeal || 'None today'}`}
                icon={Utensils}
                color="green"
                onClick={() => setSelectedMetric('feedings')}
                isActive={selectedMetric === 'feedings'}
                expandedCards={expandedCards}
                toggleCard={toggleCard}
              />

              <GuardianMetricCard
                id="water"
                title="Water Intake"
                value={`${stats.water?.todayTotal}ml`}
                subtitle={`${stats.water?.todayCount} drink${stats.water?.todayCount !== 1 ? 's' : ''} today`}
                icon={Droplets}
                color="blue"
                onClick={() => setSelectedMetric('water')}
                isActive={selectedMetric === 'water'}
                expandedCards={expandedCards}
                toggleCard={toggleCard}
              />

              <GuardianMetricCard
                id="medications"
                title="Medications"
                value={`${stats.medications?.todayTotal}`}
                subtitle={`Total reminders: ${stats.medications?.totalReminders}`}
                icon={Pill}
                color="purple"
                onClick={() => setSelectedMetric('medications')}
                isActive={selectedMetric === 'medications'}
                expandedCards={expandedCards}
                toggleCard={toggleCard}
              />
              <GuardianMetricCard
                id="blood-sugar"
                title="Blood Sugar"
                value={stats.bloodSugar?.latest ? `${stats.bloodSugar.latest} mg/dL` : 'No data'}
                subtitle={`Avg: ${stats.bloodSugar?.average || 0} mg/dL • ${
                  stats.bloodSugar?.todayCount || 0
                } readings today`}
                icon={Heart}
                color="red"
                trend={stats.bloodSugar?.trend}
                onClick={() => setSelectedMetric('blood-sugar')}
                isActive={selectedMetric === 'blood-sugar'}
                expandedCards={expandedCards}
                toggleCard={toggleCard}
              />

              <GuardianMetricCard
                id="seizures"
                title="Seizures"
                value={stats.seizures?.thisWeek || 0}
                subtitle={`Last: ${stats.seizures?.lastSeizure || 'None'}`}
                icon={Zap}
                color="yellow"
                onClick={() => setSelectedMetric('seizures')}
                isActive={selectedMetric === 'seizures'}
                expandedCards={expandedCards}
                toggleCard={toggleCard}
              />
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
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
                <button
                  onClick={() => setSelectedMetric('overview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMetric === 'overview'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Overview
                </button>
              </div>

              {renderChart()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GuardianDashboard
