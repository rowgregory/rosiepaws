'use client'

import { magnifyingGlassIcon, plusIcon } from '@/app/lib/icons'
import AwesomeIcon from '../common/AwesomeIcon'
import Tooltip from '../common/Tooltip'
import { setOpenGuardianActionMenu, setOpenPetDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'

const GuardianToolbar = () => {
  const dispatch = useAppDispatch()
  const { zeroPets } = useAppSelector((state: RootState) => state.pet)

  return (
    <div className="sticky top-0 w-full h-[60px] bg-white z-30 px-10">
      <div className="max-w-screen-xl w-full mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-x-2 bg-[#f6f5f7] rounded-md max-w-lg w-full h-9 py-2.5 pl-3 pr-7">
          <AwesomeIcon icon={magnifyingGlassIcon} className="w-3 h-3" />
          <input
            className="w-full focus:outline-none bg-transparent placeholder:text-sm placeholder:text-[#484954]"
            placeholder="Search"
          />
        </div>
        <div className="flex">
          <Tooltip text={zeroPets ? `Add pet` : `Create`} position="bottom">
            <button
              onClick={() => (zeroPets ? dispatch(setOpenPetDrawer()) : dispatch(setOpenGuardianActionMenu()))}
              className="bg-indigo-500 text-white text-sm w-6 h-6 rounded-full font-medium flex justify-center items-center gap-x-1"
            >
              <AwesomeIcon icon={plusIcon} className="text-white w-3 h-3" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default GuardianToolbar
