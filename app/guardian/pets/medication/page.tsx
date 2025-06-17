'use client'

import GuardianPageHeader from '@/app/components/guardian/GuardianPageHeader'
import { setOpenMedicationDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import { Pill } from 'lucide-react'
import React from 'react'

const MedicationIntake = () => {
  const { medications } = useAppSelector((state: RootState) => state.pet)

  return (
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <GuardianPageHeader
          Icon={Pill}
          data={medications}
          title="Medications"
          subtitle="Track meals and nutrition habits"
          setOpenDrawer={setOpenMedicationDrawer}
          btnText="medication"
          overlayGradient="bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
          iconGradient="bg-gradient-to-br from-indigo-500 to-purple-500"
          buttonGradient="bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        />
      </div>
    </div>
  )
}

export default MedicationIntake
