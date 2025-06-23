'use client'

import { setOpenGuardianActionMenu, setOpenPetDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import GuardianActionMenuButton from './GuardianActionMenuButton'
import { Bell, PawPrint, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { setOpenNotificationDrawer } from '@/app/redux/features/dashboardSlice'

const GuardianToolbar = () => {
  const dispatch = useAppDispatch()
  const { zeroPets } = useAppSelector((state: RootState) => state.pet)

  return (
    <div className="bg-white border-b border-gray-100 px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - could add breadcrumbs or current pet info later */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Pet Care Dashboard</h1>
        </div>
        {/* Right side - actions */}
        <div className="flex items-center gap-3">
          {/* Guardian Action Menu Button */}
          <GuardianActionMenuButton
            onClick={() => (zeroPets ? dispatch(setOpenPetDrawer()) : dispatch(setOpenGuardianActionMenu()))}
          />
          {/* Notifications */}
          <button
            onClick={() => dispatch(setOpenNotificationDrawer())}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* Settings */}
          <Link
            href="/guardian/settings"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Profile */}
          <Link
            href="/guardian/profile"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GuardianToolbar
