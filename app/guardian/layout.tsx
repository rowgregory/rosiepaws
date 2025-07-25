'use client'

import React, { FC } from 'react'
import { ChildrenProps } from '../types/common'
import CreatePetDrawer from '../drawers/create/CreatePetDrawer'
import GuardianNavigation from '../components/guardian/GuardianNavigation'
// import GuardianToolbar from '../components/guardian/GuardianToolbar'
import { useFetchMyPetsQuery } from '../redux/services/petApi'
import CreatePainScoreDrawer from '../drawers/create/CreatePainScoreDrawer'
import GuardianActionMenu from '../components/guardian/GuardianActionMenu'
import CreateFeedingDrawer from '../drawers/create/CreateFeedingDrawer'
import CreateBloodSugarDrawer from '../drawers/create/CreateBloodSugarDrawer'
import CreateWaterDrawer from '../drawers/create/CreateWaterDrawer'
import CreateMedicationDrawer from '../drawers/create/CreateMedicationDrawer'
import UpdateMedicationDrawer from '../drawers/update/UpdateMedicationDrawer'
import CreateSeizureDrawer from '../drawers/create/CreateSeizureDrawer'
import NotificationDrawer from '../drawers/general/NotificationDrawer'
import CreateWalkDrawer from '../drawers/create/CreateWalkDrawer'
import CreateAppointmentDrawer from '../drawers/create/CreateAppointmentDrawer'
import CreateMovementDrawer from '../drawers/create/CreateMovementDrawer'
import UpdatePetDrawer from '../drawers/update/UpdatePetDrawer'

const GuardianLayout: FC<ChildrenProps> = ({ children }) => {
  useFetchMyPetsQuery({})

  return (
    <>
      <CreatePetDrawer />
      <UpdatePetDrawer />
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
