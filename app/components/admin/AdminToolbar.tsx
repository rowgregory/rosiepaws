'use client'

import { useAppDispatch } from '@/app/redux/store'
import { Bell, Shield, Settings, User, Star } from 'lucide-react'
import Link from 'next/link'
import { setOpenNotificationDrawer } from '@/app/redux/features/dashboardSlice'
import AdminActionMenuButton from './AdminActionMenuButton'
import { setOpenAdminActionMenu } from '@/app/redux/features/adminSlice'

const AdminToolbar = () => {
  const dispatch = useAppDispatch()

  return (
    <div className="bg-white border-b border-gray-100 px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Admin branding and title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Right side - actions */}
        <div className="flex items-center gap-3">
          {/* Admin Action Menu Button */}
          <AdminActionMenuButton onClick={() => dispatch(setOpenAdminActionMenu())} />

          {/* User Management */}
          <Link
            href="/admin/subscriptions"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            title="User Management"
          >
            <Star className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <button
            onClick={() => dispatch(setOpenNotificationDrawer())}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Profile */}
          <Link
            href="/admin/profile"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            title="Admin Profile"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminToolbar
