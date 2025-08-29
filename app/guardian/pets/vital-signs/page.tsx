'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/app/redux/store'
import { RootState } from '@/app/redux/store'

import { Heart, Thermometer, Activity, AlertTriangle } from 'lucide-react'
import { NORMAL_RANGES } from '@/app/lib/constants'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import { vitalSignsCreateTokenCost } from '@/app/lib/constants/public/token'
import { setOpenVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'
import CleanHeader from '@/app/components/guardian/CleanHeader'
import { isVitalSignNormal } from '@/app/validations/validateVitalSignsForm'
import { getPetTypeLabel, getTimeInfo } from '@/app/lib/utils'
import VitalSignsCard from '@/app/components/guardian/vital-signs/VitalSignsCard'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'

const VitalSigns = () => {
  const { zeroVitalSigns, vitalSigns } = useAppSelector((state: RootState) => state.vitalSigns)

  const shouldAnimate = useInitialAnimation(vitalSigns)

  // Helper functions for calculations
  const getTodaysVitalSigns = (vitalSigns: any[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return vitalSigns.filter((vs) => {
      const vsDate = new Date(vs.createdAt)
      vsDate.setHours(0, 0, 0, 0)
      return vsDate.getTime() === today.getTime()
    })
  }

  const calculateAveragePainScore = (vitalSigns: any[]) => {
    if (!vitalSigns.length) return 0
    const totalPain = vitalSigns.reduce((sum, vs) => sum + (vs.painScore || 0), 0)
    return (totalPain / vitalSigns.length).toFixed(1)
  }

  const getAbnormalVitalSigns = (vitalSigns: any[]) => {
    return vitalSigns.filter((vs) => {
      const petType = vs.petType?.toUpperCase()
      const ranges = NORMAL_RANGES[petType as keyof typeof NORMAL_RANGES]
      if (!ranges) return false

      return (
        !isVitalSignNormal('temperature', vs.temperature, petType) ||
        !isVitalSignNormal('heartRate', vs.heartRate, petType) ||
        !isVitalSignNormal('respiratoryRate', vs.respiratoryRate, petType) ||
        vs.painScore > 1 ||
        (vs.hydrationStatus && vs.hydrationStatus !== 'NORMAL')
      )
    })
  }

  const getLatestVitalsByPet = (vitalSigns: any[]) => {
    const petMap = new Map()
    vitalSigns.forEach((vs) => {
      const petId = vs.pet?.id || vs.petId
      if (!petMap.has(petId) || new Date(vs.createdAt) > new Date(petMap.get(petId).createdAt)) {
        petMap.set(petId, vs)
      }
    })
    return Array.from(petMap.values())
  }

  // Calculations
  const todaysVitalSigns = getTodaysVitalSigns(vitalSigns || [])
  const todaysVitalSignsCount = todaysVitalSigns.length
  const averagePainScore = calculateAveragePainScore(vitalSigns || [])
  const abnormalVitalSigns = getAbnormalVitalSigns(vitalSigns || [])
  const latestVitalsByPet = getLatestVitalsByPet(vitalSigns || [])
  const petsRequiringAttention = abnormalVitalSigns.length

  if (zeroVitalSigns) {
    return (
      <ZeroLogs
        btnText="Log Vital Signs"
        title="No vital signs logged yet"
        subtitle="Start tracking your pet's vital signs to monitor their health, detect issues early, and maintain comprehensive medical records."
        tokens={vitalSignsCreateTokenCost}
        func={setOpenVitalSignsDrawer}
        formName="vitalSignsForm"
      />
    )
  }

  return (
    <>
      <div className="h-[calc(100dvh-96px)]">
        <div className="mx-auto px-6 space-y-8">
          {/* Header */}
          <CleanHeader
            btnText="Record Vital Signs"
            func={setOpenVitalSignsDrawer}
            tokens={vitalSignsCreateTokenCost}
            formName="vitalSignsForm"
          />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Latest Vital Signs Highlight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Latest Assessment</h2>
                  </div>

                  {(() => {
                    const latest = vitalSigns[0]

                    const petType = latest?.pet?.type?.toUpperCase()
                    const ranges = NORMAL_RANGES[petType as keyof typeof NORMAL_RANGES]

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{latest?.pet?.name}</h3>
                            <p className="text-sm text-gray-500">
                              {getPetTypeLabel(latest?.pet?.type)} • {getTimeInfo(latest?.createdAt)?.relative}
                            </p>
                          </div>
                        </div>

                        {/* Key Vitals */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Thermometer className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-red-700">Temperature</span>
                            </div>
                            <div className="text-2xl font-bold text-red-900">{latest?.temperature}°F</div>
                            {ranges && (
                              <div className="text-xs text-red-600">
                                Normal: {ranges.temperature.min}-{ranges.temperature.max}°F
                              </div>
                            )}
                          </div>

                          <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Heart className="w-4 h-4 text-pink-500" />
                              <span className="text-sm font-medium text-pink-700">Heart Rate</span>
                            </div>
                            <div className="text-2xl font-bold text-pink-900">{latest?.heartRate}</div>
                            <div className="text-xs text-pink-600">bpm</div>
                          </div>

                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Activity className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-700">Respiratory</span>
                            </div>
                            <div className="text-2xl font-bold text-green-900">{latest?.respiratoryRate}</div>
                            <div className="text-xs text-green-600">/min</div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </motion.div>

              {/* All Vital Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vitalSigns.map((vitalSign, index) => (
                  <VitalSignsCard
                    key={vitalSign.id}
                    vitalSigns={vitalSign}
                    index={index}
                    shouldAnimate={shouldAnimate}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Quick Overview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Overview</h3>
                <div className="space-y-4">
                  {/* Today's Stats Section */}
                  {todaysVitalSigns.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Today&apos;s Assessments</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Recorded Today</span>
                          <span className="font-semibold text-blue-900">{todaysVitalSignsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Pets Checked</span>
                          <span className="font-semibold text-blue-900">
                            {new Set(todaysVitalSigns.map((vs) => vs.pet?.id || vs.petId)).size}
                          </span>
                        </div>
                        {petsRequiringAttention > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-red-700">Need Attention</span>
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="font-semibold text-red-900">{petsRequiringAttention}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Alert Section */}
                  {petsRequiringAttention > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Health Alerts</span>
                      </h4>
                      <div className="space-y-1">
                        <p className="text-xs text-yellow-700">
                          {petsRequiringAttention} vital sign{petsRequiringAttention > 1 ? 's' : ''} need review
                        </p>
                        <p className="text-xs text-yellow-600">
                          Check abnormal readings and consider veterinary consultation
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overall Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Records</span>
                      <span className="font-semibold text-gray-900">{vitalSigns.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pets Monitored</span>
                      <span className="font-semibold text-gray-900">{latestVitalsByPet.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Pain Score</span>
                      <span className="font-semibold text-gray-900">{averagePainScore}/4</span>
                    </div>
                    {vitalSigns.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Recorded</span>
                        <span className="font-semibold text-gray-900">
                          {getTimeInfo(vitalSigns[0]?.createdAt)?.relative}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {vitalSigns.slice(0, 8).map((vitalSign, index) => {
                    return (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{vitalSign?.pet?.name}</div>
                            <div className="text-xs text-gray-500">{getTimeInfo(vitalSign?.createdAt)?.relative}</div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center space-x-1">
                              <Thermometer className="w-3 h-3 text-red-400" />
                              <span className="font-medium text-gray-900 text-sm">{vitalSign?.temperature}°F</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Pet Health Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Pet Status Summary</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {latestVitalsByPet.slice(0, 5).map((vitalSign, index) => {
                    return (
                      <div key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                {vitalSign?.pet?.type === 'DOG' ? 'D' : 'C'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{vitalSign?.pet?.name}</div>
                              <div className="text-xs text-gray-500">{getTimeInfo(vitalSign?.createdAt)?.relative}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VitalSigns
