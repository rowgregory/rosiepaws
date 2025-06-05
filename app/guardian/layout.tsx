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

const GuardianLayout: FC<ChildrenProps> = ({ children }) => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  useFetchMyPetsQuery({})

  return (
    <>
      <CreatePetDrawer />
      <CreatePainScoreDrawer />
      <CreateFeedingDrawer />
      <GuardianActionMenu />
      <div className="flex">
        <GuardianNavigation toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
        <div className={`flex flex-col w-full ${toggleSidebar ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-60'}`}>
          <GuardianToolbar />
          <div className="px-10 pt-2">
            <div className="max-w-screen-xl w-full mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GuardianLayout
