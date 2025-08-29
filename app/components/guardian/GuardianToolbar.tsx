'use client'

import { useAppDispatch } from '@/app/redux/store'
import { ArrowLeft, Bell, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { setOpenNotificationDrawer } from '@/app/redux/features/dashboardSlice'
import { motion } from 'framer-motion'

const GuardianToolbar = () => {
  const dispatch = useAppDispatch()

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - could add breadcrumbs or current pet info later */}
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-4 h-4" />
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="flex items-center space-x-2"
            >
              <div className="w-12 h-12 bg-contain bg-logo bg-no-repeat bg-center" />
            </motion.div>
          </Link>
        </div>
        {/* Right side - actions */}
        <div className="flex items-center gap-3">
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
