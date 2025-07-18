'use client'

import React, { FC } from 'react'
import { ChildrenProps } from '../types/common'
import CreatePetDrawer from '../drawers/CreatePetDrawer'
import GuardianNavigation from '../components/guardian/GuardianNavigation'
// import GuardianToolbar from '../components/guardian/GuardianToolbar'
import { useFetchMyPetsQuery } from '../redux/services/petApi'
import CreatePainScoreDrawer from '../drawers/CreatePainScoreDrawer'
import GuardianActionMenu from '../components/guardian/GuardianActionMenu'
import CreateFeedingDrawer from '../drawers/CreateFeedingDrawer'
import CreateBloodSugarDrawer from '../drawers/CreateBloodSugarDrawer'
import CreateWaterDrawer from '../drawers/CreateWaterDrawer'
import CreateMedicationDrawer from '../drawers/CreateMedicationDrawer'
import UpdateMedicationDrawer from '../drawers/UpdateMedicationDrawer'
import CreateSeizureDrawer from '../drawers/CreateSeizureDrawer'
import NotificationDrawer from '../drawers/NotificationDrawer'
import CreateWalkDrawer from '../drawers/CreateWalkDrawer'
import CreateAppointmentDrawer from '../drawers/CreateAppointmentDrawer'
import CreateMovementDrawer from '../drawers/CreateMovementDrawer'

const GuardianLayout: FC<ChildrenProps> = ({ children }) => {
  useFetchMyPetsQuery({})

  return (
    <>
      <CreatePetDrawer />
      <CreatePainScoreDrawer />
      <CreateFeedingDrawer />
      <CreateBloodSugarDrawer />
      <CreateWaterDrawer />
      <CreateMedicationDrawer />
      <CreateSeizureDrawer />
      <CreateWalkDrawer />
      <CreateAppointmentDrawer />
      <CreateMovementDrawer />
      <UpdateMedicationDrawer />
      <GuardianActionMenu />
      <NotificationDrawer />
      {/* <GuardianToolbar /> */}
      <div className="flex">
        <GuardianNavigation />
        <div className={`flex flex-col w-full mx-auto ml-0 md:ml-64`}>{children}</div>
      </div>
    </>
  )
}

export default GuardianLayout
