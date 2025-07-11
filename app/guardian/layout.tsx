'use client'

import React, { FC, useState } from 'react'
import { ChildrenProps } from '../types/common.types'
import CreatePetDrawer from '../drawers/CreatePetDrawer'
import GuardianNavigation from '../components/guardian/GuardianNavigation'
import GuardianToolbar from '../components/guardian/GuardianToolbar'
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

const GuardianLayout: FC<ChildrenProps> = ({ children }) => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
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
      <UpdateMedicationDrawer />
      <GuardianActionMenu />
      <NotificationDrawer />
      <GuardianToolbar />
      <div className="flex">
        <GuardianNavigation toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
        <div
          className={`flex flex-col w-full mt-[81px] max-w-screen-2xl mx-auto px-10 py-6 ${toggleSidebar ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-64'}`}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default GuardianLayout
