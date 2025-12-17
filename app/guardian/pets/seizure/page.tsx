'use client'

import { useState } from 'react'
import { RootState, useAppSelector } from '@/app/redux/store'
import VideoModal from '@/app/modals/VideoModal'
import CleanHeader from '@/app/components/guardian/CleanHeader'
import { getTodaysSeizures } from '@/app/lib/utils'
import { ISeizure } from '@/app/types'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import SeizureCard from '@/app/components/guardian/seizure/SeizureCard'
import SeizureCalendarDrawer from '@/app/drawers/general/SeizureCalendarDrawer'
import { setOpenSeizureDrawer } from '@/app/redux/features/seizureSlice'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'
import AlertForRecentActivity from '@/app/components/guardian/seizure/AlertForRecentActivity'
import LatestSeizure from '@/app/components/guardian/seizure/LatestSeizure'
import QuickOverview from '@/app/components/guardian/seizure/QuickOverview'
import EmergencyInfo from '@/app/components/guardian/seizure/EmergencyInfo'
import QuickActions from '@/app/components/guardian/seizure/QuickActions'

interface ISelectedVideo {
  url: string
  filename?: string
  petName?: string
  date?: string
}

const Seizure = () => {
  const { zeroSeizures, seizures } = useAppSelector((state: RootState) => state.seizure)
  const todaysSeizures = getTodaysSeizures(seizures || [])
  const todaysSeizuresCount = todaysSeizures?.length
  const latestSeizure = seizures?.length > 0 ? seizures[0] : null
  const [selectedVideo, setSelectedVideo] = useState<ISelectedVideo | null>(null)
  const shouldAnimate = useInitialAnimation(seizures)
  const close = () => setSelectedVideo(null)

  if (zeroSeizures) {
    return (
      <ZeroLogs
        btnText="Log seizure"
        title="No seizures logged"
        subtitle="Track seizure episodes to monitor patterns and help your veterinarian provide better care."
        tokens={0}
        func={setOpenSeizureDrawer}
        formName="seizureForm"
      />
    )
  }

  return (
    <>
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={close}
        videoUrl={selectedVideo?.url ?? ''}
        petName={selectedVideo?.petName}
        seizureDate={selectedVideo?.date}
      />
      <SeizureCalendarDrawer />
      <div className="min-h-[calc(100dvh-64px)] pb-20">
        <div className="mx-auto px-6 space-y-8">
          {/* Header */}
          <CleanHeader btnText="Log Seizure" func={setOpenSeizureDrawer} tokens={0} formName="seizureForm" />
          {/* Alert for Recent Activity */}
          {todaysSeizuresCount > 0 && (
            <AlertForRecentActivity todaysSeizures={todaysSeizures} todaysSeizuresCount={todaysSeizuresCount} />
          )}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Latest Seizure Highlight */}
              {latestSeizure && <LatestSeizure latestSeizure={latestSeizure} />}
              {/* All Seizure Episodes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seizures?.map((seizure: ISeizure, i: number) => {
                  return (
                    <SeizureCard
                      key={seizure.id}
                      index={i}
                      seizure={seizure}
                      setSelectedVideo={setSelectedVideo}
                      shouldAnimate={shouldAnimate}
                    />
                  )
                })}
              </div>
            </div>
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Quick Overview */}
              <QuickOverview
                latestSeizure={latestSeizure}
                seizures={seizures}
                todaysSeizures={todaysSeizures}
                todaysSeizuresCount={todaysSeizuresCount}
              />
              {/* Emergency Info */}
              <EmergencyInfo />
              {/* Quick Actions */}
              <QuickActions seizures={seizures} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Seizure
