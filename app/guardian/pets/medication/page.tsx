'use client'

import React from 'react'
import { Clock, Pill } from 'lucide-react'
import { motion } from 'framer-motion'
import { RootState, useAppSelector } from '@/app/redux/store'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import { MedicationCard } from '@/app/components/guardian/medications/MedicationCard'
import { IMedication } from '@/app/types'
import { medicationCreateTokenCost } from '@/app/lib/constants/public/token'
import {
  getActiveMedications,
  getMedicationStatus,
  getTodaysMedicationSchedule,
  getUpcomingReminders,
  getUpcomingTime
} from '@/app/lib/utils'
import { setOpenMedicationCreateDrawer } from '@/app/redux/features/medicationSlice'

const MedicationIntake = () => {
  const { zeroMedications, medications } = useAppSelector((state: RootState) => state.pet)
  const activeMedications = getActiveMedications(medications || [])
  const upcomingReminders = getUpcomingReminders(medications || [])

  if (zeroMedications) {
    return (
      <ZeroLogs
        btnText="Add medication"
        title="No medications added yet"
        subtitle="Track your pet's medications, set reminders, and monitor dosage schedules."
        tokens={medicationCreateTokenCost}
        func={setOpenMedicationCreateDrawer}
      />
    )
  }

  return (
    <div className="h-[calc(100dvh-96px)]">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader btnText="Add Medication" func={setOpenMedicationCreateDrawer} tokens={medicationCreateTokenCost} />
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Alert Section for Upcoming Only */}
            {upcomingReminders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Upcoming Medications
                  </h2>
                  <span className="text-sm text-blue-600">Next {upcomingReminders.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {upcomingReminders.map((medication) => (
                    <div key={medication.id} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{medication.drugName}</h3>
                          <p className="text-sm text-gray-600">{medication.pet?.name}</p>
                          <p className="text-sm text-blue-600">Due: {getUpcomingTime(medication)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {medication.dosage} {medication.dosageUnit}
                          </div>
                          <div className="text-xs text-gray-500">{medication.frequency}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Active Medications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMedications?.map((medication: IMedication, index: number) => {
                const status = getMedicationStatus(medication)
                const StatusIcon = status.icon

                return (
                  <MedicationCard
                    key={medication.id}
                    medication={medication}
                    index={index}
                    status={status}
                    StatusIcon={StatusIcon}
                  />
                )
              })}
            </div>

            {/* All Medications (including expired) */}
            {medications.length > activeMedications.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">All Medications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medications?.map((medication: IMedication, index: number) => {
                      const status = getMedicationStatus(medication)
                      const StatusIcon = status.icon

                      return (
                        <MedicationCard
                          key={medication.id}
                          medication={medication}
                          index={index}
                          status={status}
                          StatusIcon={StatusIcon}
                          showExpired={true}
                        />
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
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
                {/* General Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Medications</span>
                    <span className="font-semibold text-gray-900">{medications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Medications</span>
                    <span className="font-semibold text-green-600">{activeMedications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">With Reminders</span>
                    <span className="font-semibold text-blue-600">
                      {medications.filter((med) => med.reminderEnabled).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Upcoming (Next 4hrs)</span>
                    <span className="font-semibold text-blue-600">{upcomingReminders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expired/Completed</span>
                    <span className="font-semibold text-orange-600">
                      {medications.length - activeMedications.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unique Drugs</span>
                    <span className="font-semibold text-gray-900">
                      {new Set(medications.map((med) => med.drugName.toLowerCase())).size}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Medication Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Today&apos;s Schedule</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {getTodaysMedicationSchedule(medications)
                  .slice(0, 8)
                  .map((scheduleItem, index) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'upcoming':
                          return 'text-blue-600'
                        case 'completed':
                          return 'text-green-600'
                        default:
                          return 'text-gray-600'
                      }
                    }

                    const getStatusLabel = (status: string) => {
                      switch (status) {
                        case 'upcoming':
                          return 'Upcoming'
                        case 'completed':
                          return 'Given'
                        default:
                          return 'Scheduled'
                      }
                    }

                    return (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{scheduleItem.medication.drugName}</div>
                            <div className="text-xs text-gray-500">{scheduleItem.medication.pet?.name}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {scheduleItem.medication.dosage} {scheduleItem.medication.dosageUnit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{scheduleItem.time}</div>
                            <div className={`text-xs capitalize ${getStatusColor(scheduleItem.status)}`}>
                              {getStatusLabel(scheduleItem.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                {getTodaysMedicationSchedule(medications).length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Pill className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No medications scheduled for today</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicationIntake
