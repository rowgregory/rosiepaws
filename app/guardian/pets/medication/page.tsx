'use client'

import React, { useState, useEffect } from 'react'
import { Pill } from 'lucide-react'
import { setOpenMedicationDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import GuardianPageHeader from '@/app/components/guardian/GuardianPageHeader'
import { getMedicationStatus, getTimeUntilNext } from '@/app/utils/medication-helpers'
import MedicationOverviewStats from '@/app/components/guardian/medications/MedicationOverviewStats'
import ActiveMedicationCard from '@/app/components/guardian/medications/ActiveMedicationCard'
import InactiveMedicationCard from '@/app/components/guardian/medications/InactiveMedicationCard'

const MedicationIntake = () => {
  const { medications } = useAppSelector((state: RootState) => state.pet)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const activeMedications = medications?.filter((med) => med.reminderEnabled) || []
  const inactiveMedications = medications?.filter((med) => !med.reminderEnabled) || []

  return (
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <GuardianPageHeader
          Icon={Pill}
          data={medications}
          title="Medications"
          subtitle="Track medication schedules and reminders"
          setOpenDrawer={setOpenMedicationDrawer}
          btnText="medication"
          overlayGradient="bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
          iconGradient="bg-gradient-to-br from-indigo-500 to-purple-500"
          buttonGradient="bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        />

        {/* Overview Stats */}
        <MedicationOverviewStats activeMedications={activeMedications} currentTime={currentTime} />

        {/* Active Medications */}
        {activeMedications.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Medications</h2>
            <div className="grid gap-4">
              {activeMedications.map((medication, index) => {
                const status = getMedicationStatus(medication, currentTime)
                const timeRemaining = getTimeUntilNext(medication.reminderTimes, currentTime)
                const StatusIcon = status.icon

                return (
                  <ActiveMedicationCard
                    key={medication.id}
                    medication={medication}
                    status={status}
                    timeRemaining={timeRemaining}
                    currentTime={currentTime}
                    StatusIcon={StatusIcon}
                    index={index}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Inactive Medications */}
        {inactiveMedications.length > 0 && <InactiveMedicationCard inactiveMedications={inactiveMedications} />}

        {/* Empty State */}
        {medications?.length === 0 && (
          <div className="text-center py-12">
            <Pill className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No medications</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your pet&apos;s first medication.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicationIntake
