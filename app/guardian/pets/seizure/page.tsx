'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus } from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'
import GuardianPageHeader from '@/app/components/guardian/GuardianPageHeader'
import { setOpenSeizureDrawer } from '@/app/redux/features/petSlice'
import VideoModal from '@/app/modals/VideoModal'
import GuardianSeizureGridCard from '@/app/components/guardian/GuardianSeizureGridCard'

const SeizureTracking = () => {
  const { seizures, zeroSeizures } = useAppSelector((state: RootState) => state.pet)
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string
    filename?: string
    petName?: string
    date?: string
  } | null>(null)

  const getEmergencyStatus = (seizure: any, dailyCount: number) => {
    const duration = seizure.duration || 0
    if (duration >= 300 || dailyCount > 5) {
      return { level: 'emergency', text: 'Emergency', color: 'bg-red-100 text-red-800 border-red-200' }
    }
    if (duration >= 180 || dailyCount > 3) {
      return { level: 'warning', text: 'Monitor', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    }
    return { level: 'normal', text: 'Normal', color: 'bg-green-100 text-green-800 border-green-200' }
  }

  const getDailySeizureCount = (seizure: any, allSeizures: any[]) => {
    const seizureDate = new Date(seizure.occurredAt).toDateString()
    return allSeizures.filter((s) => s.petId === seizure.petId && new Date(s.occurredAt).toDateString() === seizureDate)
      .length
  }

  return (
    <>
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ''}
        petName={selectedVideo?.petName}
        seizureDate={selectedVideo?.date}
      />
      <div className="min-h-dvh">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <GuardianPageHeader
            Icon={Zap}
            data={seizures}
            title="Seizures"
            subtitle="Track episodes for better management"
            setOpenDrawer={setOpenSeizureDrawer}
            btnText="Seizure"
            overlayGradient="bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
            iconGradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            buttonGradient="bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          />

          {zeroSeizures ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Zap className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Seizures</h3>
              <p className="text-gray-500 mb-6">Track episodes for better management</p>
              <motion.button
                onClick={() => setOpenSeizureDrawer()}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Seizure</span>
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Seizures Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {seizures.map((seizure, index) => {
                  const dailyCount = getDailySeizureCount(seizure, seizures)
                  const emergencyStatus = getEmergencyStatus(seizure, dailyCount)
                  const duration = seizure.duration || 0

                  return (
                    <GuardianSeizureGridCard
                      key={seizure.id}
                      seizure={seizure}
                      index={index}
                      emergencyStatus={emergencyStatus}
                      duration={duration}
                      setSelectedVideo={setSelectedVideo}
                    />
                  )
                })}
              </div>

              {/* Summary Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seizure Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{seizures.length}</div>
                    <div className="text-sm text-gray-600">Total Seizures</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {seizures.filter((s) => (s.duration || 0) >= 60).length}
                    </div>
                    <div className="text-sm text-gray-600">1+ Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {seizures.filter((s) => (s.duration || 0) >= 180).length}
                    </div>
                    <div className="text-sm text-gray-600">3+ Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {seizures.filter((s) => (s.duration || 0) >= 300).length}
                    </div>
                    <div className="text-sm text-gray-600">Emergency (5+ min)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SeizureTracking
