import React from 'react'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { motion } from 'framer-motion'
import { RootState, useAppSelector, useUserSelector } from '@/app/redux/store'
import { adminNavigationLinks } from '@/app/lib/utils'
import CollapsedProfileIndicator from '../navigation/CollapsedProfileIndicator'
import ToggleButton from '../navigation/ToggleButton'
import BottomProfileSection from './nagivation/BottomProfileSection'
import HeaderSection from '../navigation/HeaderSection'
import NavigationLinks from '../navigation/NavigationLinks'

const AdminNavigation = () => {
  const { navigation } = useAppSelector((state: RootState) => state.app)
  const path = useCustomPathname()
  const { user, loading } = useUserSelector()
  const isSuperUser = user?.isSuperUser ?? false
  const linkData = adminNavigationLinks(path, isSuperUser)

  return (
    <motion.div
      animate={{ width: navigation ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden lg:block fixed top-0 left-0 min-h-screen bg-white border-r border-gray-200 z-20"
    >
      {/* Header Section */}
      <div className="mb-7">
        <HeaderSection toggleSidebar={navigation} user={user} title="Admin" loading={loading} />
      </div>

      {/* Toggle Button */}
      <ToggleButton toggleSidebar={navigation} />

      {/* Navigation Links */}
      <NavigationLinks toggleSidebar={navigation} linkData={linkData} />

      {/* Bottom Profile Section */}
      <BottomProfileSection navigation={navigation} user={user} />

      {/* Collapsed Profile Indicator */}
      <CollapsedProfileIndicator
        toggleSidebar={navigation}
        setPetDropdownOpen={() => {}}
        initial={user?.email?.charAt(0) ?? ''}
      />
    </motion.div>
  )
}

export default AdminNavigation
