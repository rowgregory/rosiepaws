'use client'

import GuardianPageHeader from '@/app/components/guardian/GuardianPageHeader'
import { setOpenSeizureDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import { Zap } from 'lucide-react'
import React from 'react'

const SeizureTracking = () => {
  const { seizures } = useAppSelector((state: RootState) => state.pet)

  return (
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <GuardianPageHeader
          Icon={Zap}
          data={seizures}
          title="Seizures"
          subtitle="Track episodes for better management"
          setOpenDrawer={setOpenSeizureDrawer}
          btnText="Add seizure"
          overlayGradient="bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
          iconGradient="bg-gradient-to-br from-yellow-500 to-orange-500"
          buttonGradient="bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        />
      </div>
    </div>
  )
}

export default SeizureTracking
