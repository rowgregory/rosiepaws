'use client'

import React, { FC, useState } from 'react'
import { IChildren } from '../types/common'
import GuardianNavigation from '../components/guardian/GuardianNavigation'
// import GuardianToolbar from '../components/guardian/GuardianToolbar'
import GuardianActionMenu from '../components/guardian/GuardianActionMenu'
import MedicationDrawer from '../drawers/guardian/MedicationDrawer'
import NotificationDrawer from '../drawers/general/NotificationDrawer'
import PetDrawer from '../drawers/guardian/PetDrawer'
import WaterDrawer from '../drawers/guardian/WaterDrawer'
import MovementDrawer from '../drawers/guardian/MovementDrawer'
import BloodSugarDrawer from '../drawers/guardian/BloodSugarDrawer'
import SeizureDrawer from '../drawers/guardian/SeizureDrawer'
import VitalSignsDrawer from '../drawers/guardian/VitalSignsDrawer'
import FeedingDrawer from '../drawers/guardian/FeedingDrawer'
import PainDrawer from '../drawers/guardian/PainDrawer'
import NeedToUpgradeDrawer from '../drawers/general/NeedToUpgradeDrawer'
import AppointmentDrawer from '../drawers/guardian/AppointmentDrawer'

const GuardianLayout: FC<IChildren> = ({ children }) => {
  const [toggleSidebar, setToggleSidebar] = useState(false)

  return (
    <>
      <PetDrawer />
      <PainDrawer />
      <FeedingDrawer />
      <WaterDrawer />
      <VitalSignsDrawer />
      <MovementDrawer />
      <AppointmentDrawer />
      <MedicationDrawer />
      <BloodSugarDrawer />
      <SeizureDrawer />
      <GuardianActionMenu />
      <NotificationDrawer />
      <NeedToUpgradeDrawer />

      {/* <GuardianToolbar /> */}
      <div className="flex">
        <GuardianNavigation toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
        <div
          className={`flex flex-col mx-auto duration-300 w-full ${toggleSidebar ? 'lg:w-[calc(100vw-64px)] lg:ml-16' : 'lg:w-[calc(100vw-256px)] lg:ml-64'}`}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default GuardianLayout
