'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Video, FileText, Phone } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import VideoModal from '@/app/modals/VideoModal'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import {
  formatDuration,
  getLocalISOString,
  getRecentSeizures,
  getSeizureSeverity,
  getTimeInfo,
  getTodaysSeizures
} from '@/app/lib/utils'
import { ISeizure } from '@/app/types'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import SeizureCard from '@/app/components/guardian/seizure/SeizureCard'
import { seizureCreateTokenCost } from '@/app/lib/constants/public/token'
import { generateSeizurePDFReport } from '@/app/lib/utils/reports/seizure-pdf-report-generator'
import { setInputs } from '@/app/redux/features/formSlice'
import SeizureCalendarDrawer from '@/app/drawers/general/SeizureCalendarDrawer'
import { setOpenSeizureCalendarDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenSeizureCreateDrawer } from '@/app/redux/features/seizureSlice'

const Seizure = () => {
  const { zeroSeizures, seizures, pet } = useAppSelector((state: RootState) => state.pet)
  const todaysSeizures = getTodaysSeizures(seizures || [])
  const todaysSeizuresCount = todaysSeizures?.length
  const latestSeizure = seizures?.length > 0 ? seizures[0] : null
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string
    filename?: string
    petName?: string
    date?: string
  } | null>(null)
  const dispatch = useAppDispatch()

  const handleDownload = async () => {
    try {
      setIsGenerating(true)

      const doc = await generateSeizurePDFReport(seizures, {
        includeCharts: true,
        includeFullLog: true,
        ownerName: 'John Doe'
      })

      // Generate filename with date
      const today = new Date().toISOString().split('T')[0]
      const filename = `${pet?.name}_Seizure_Report_${today}.pdf`

      // Download the PDF
      doc.save(filename)
    } catch {
      alert('Error generating PDF report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (zeroSeizures) {
    return (
      <ZeroLogs
        btnText="Log seizure"
        title="No seizures recorded"
        subtitle="Track seizure episodes to monitor patterns and help your veterinarian provide better care."
        tokens={seizureCreateTokenCost}
        func={setOpenSeizureCreateDrawer}
      />
    )
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
      <SeizureCalendarDrawer />
      <div className="min-h-[calc(100dvh-96px)] pb-20">
        <div className="mx-auto px-6 space-y-8">
          {/* Header */}
          <CleanHeader btnText="Log Seizure" func={setOpenSeizureCreateDrawer} tokens={seizureCreateTokenCost} />

          {/* Alert for Recent Activity */}
          {todaysSeizuresCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-red-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Seizure Activity Today
                </h2>
                <span className="text-sm text-red-600">
                  {todaysSeizuresCount} episode{todaysSeizuresCount > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {todaysSeizures.map((seizure) => (
                  <div key={seizure.id} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{seizure.pet?.name}</h3>
                        <p className="text-sm text-gray-600">{getTimeInfo(new Date(seizure.timeRecorded))?.time}</p>
                        {seizure.duration && (
                          <p className="text-sm text-red-600">Duration: {formatDuration(seizure.duration)}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {seizure.videoUrl && <div className="text-xs text-blue-600 mb-1">📹 Video recorded</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Latest Seizure Highlight */}
              {latestSeizure && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Latest Seizure Episode</h2>
                      <span className="text-sm text-gray-500">Most recent</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{latestSeizure.pet?.name}</h3>
                        <p className="text-sm text-gray-500">{getTimeInfo(latestSeizure.createdAt)?.relative}</p>
                        <p className="text-xs text-gray-400">
                          {getTimeInfo(new Date(latestSeizure.timeRecorded))?.date} at{' '}
                          {getTimeInfo(new Date(latestSeizure.timeRecorded))?.time}
                        </p>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          {latestSeizure.duration ? (
                            <>
                              <div className="text-2xl font-bold text-red-600">
                                {formatDuration(latestSeizure.duration)}
                              </div>
                              <div className="text-sm text-gray-500">Duration</div>
                            </>
                          ) : (
                            <>
                              <div className="text-lg font-bold text-gray-600">Duration</div>
                              <div className="text-sm text-gray-500">Not recorded</div>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {latestSeizure.videoUrl && (
                            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                              <Video className="w-3 h-3" />
                              <span>Video Available</span>
                            </div>
                          )}
                          {latestSeizure.notes && (
                            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                              <FileText className="w-3 h-3" />
                              <span>Notes Added</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* All Seizure Episodes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seizures?.map((seizure: ISeizure, index: number) => {
                  const severity = getSeizureSeverity(seizure.duration)
                  const SeverityIcon = severity.icon

                  return (
                    <SeizureCard
                      key={seizure.id}
                      seizure={seizure}
                      index={index}
                      severity={severity}
                      SeverityIcon={SeverityIcon}
                      setSelectedVideo={setSelectedVideo}
                    />
                  )
                })}
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
                <div className="space-y-4">
                  {/* Today's Activity */}
                  {todaysSeizuresCount > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <h4 className="text-sm font-semibold text-red-900 mb-2">Today&apos;s Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-red-700">Episodes Today</span>
                          <span className="font-semibold text-red-900">{todaysSeizuresCount}</span>
                        </div>
                        {todaysSeizures.some((s) => s.duration) && (
                          <div className="flex justify-between">
                            <span className="text-sm text-red-700">Total Duration</span>
                            <span className="font-semibold text-red-900">
                              {formatDuration(todaysSeizures.reduce((sum, s) => sum + (s.duration || 0), 0))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* General Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Episodes</span>
                      <span className="font-semibold text-gray-900">{seizures.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-semibold text-red-600">{getRecentSeizures(seizures, 7).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold text-orange-600">{getRecentSeizures(seizures, 30).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">With Video</span>
                      <span className="font-semibold text-blue-600">{seizures.filter((s) => s.videoUrl).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">With Duration</span>
                      <span className="font-semibold text-green-600">{seizures.filter((s) => s.duration).length}</span>
                    </div>
                    {latestSeizure && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Episode</span>
                        <span className="font-semibold text-gray-900">
                          {getTimeInfo(latestSeizure.createdAt)?.relative}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Emergency Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-red-50 rounded-xl border border-red-200 p-6"
              >
                <div className="flex items-center mb-3">
                  <Phone className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-red-800">Emergency Guidelines</h3>
                </div>
                <div className="space-y-3 text-sm text-red-700">
                  <div>
                    <strong>Call vet immediately if:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                      <li>Seizure lasts over 5 minutes</li>
                      <li>Multiple seizures in 24 hours</li>
                      <li>First-time seizure</li>
                      <li>Difficulty breathing after seizure</li>
                    </ul>
                  </div>
                  <div>
                    <strong>During seizure:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                      <li>Stay calm and time the episode</li>
                      <li>Keep pet safe from injury</li>
                      <li>Record video if possible</li>
                      <li>Do NOT put hands near mouth</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      dispatch(
                        setInputs({
                          formName: 'seizureForm',
                          data: {
                            seizureType: 'TONIC_CLONIC',
                            severity: 'CRITICAL',
                            duration: 5,
                            timeRecorded: getLocalISOString(new Date())
                          }
                        })
                      )
                      dispatch(setOpenSeizureCreateDrawer())
                    }}
                    className="w-full bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors text-sm"
                  >
                    🚨 Log Emergency Seizure
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors text-sm"
                  >
                    📊 Generat{isGenerating ? 'ing' : 'e'} Report for Vet
                  </button>
                  <button
                    onClick={() => dispatch(setOpenSeizureCalendarDrawer())}
                    className="w-full bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 transition-colors text-sm"
                  >
                    📅 View Seizure Calendar
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Seizure
