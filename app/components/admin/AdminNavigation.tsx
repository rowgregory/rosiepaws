import useCustomPathname from '@/app/hooks/useCustomPathname'
import React, { MouseEvent } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { useLogoutMutation } from '@/app/redux/services/authApi'
import { setAuthState } from '@/app/redux/features/authSlice'
import { useRouter } from 'next/navigation'
import Spinner from '../common/Spinner'
import { adminLinkData } from '@/app/lib/utils'

const AdminNavigation = ({ toggleSidebar, setToggleSidebar }: any) => {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const { push } = useRouter()
  const { user } = useAppSelector((state: RootState) => state.user)
  const userEmail = user?.email

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault()

    try {
      await logout({}).unwrap()
      dispatch(setAuthState({ isAuthenticated: false, id: '', role: '' }))
      push('/auth/login')
    } catch {}
  }

  return (
    <motion.div
      animate={{ width: toggleSidebar ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden lg:block fixed top-0 left-0 min-h-screen bg-white border-r border-gray-200 z-20 shadow-lg"
    >
      {/* Header Section */}
      <div
        className={`relative h-16 flex items-center border-b border-gray-100 ${
          toggleSidebar ? 'justify-center px-2' : 'px-6'
        }`}
      >
        <AnimatePresence mode="wait">
          {!toggleSidebar ? (
            <motion.div
              key="expanded-header"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RP</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-header"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">A</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setToggleSidebar(!toggleSidebar)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
      >
        <motion.div animate={{ rotate: toggleSidebar ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronRight className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* Navigation Links */}
      <div className="pt-6 pb-4">
        <nav className={`px-3 space-y-1 ${toggleSidebar ? 'flex flex-col items-center' : ''}`}>
          {adminLinkData(path).map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                onClick={(e) => (link.textKey === 'Logout' ? handleLogout(e) : {})}
                href={link.linkKey}
                className={`group flex items-center rounded-lg transition-all duration-200 ${
                  toggleSidebar ? 'w-10 h-10 justify-center p-2' : 'px-3 py-2.5 justify-between'
                } ${
                  link.isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-x-3">
                  <div className={`flex items-center justify-center ${toggleSidebar ? 'w-5 h-5' : 'w-5 h-5'}`}>
                    {isLoading && link.textKey === 'Logout' ? (
                      <Spinner fill="fill-white" track="text-gray-400" wAndH="w-4 h-4" />
                    ) : (
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        <link.icon
                          className={`w-5 h-5 transition-colors duration-200 ${
                            link.isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                          }`}
                        />
                      </motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {!toggleSidebar && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {link.textKey}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Active indicator */}
                <AnimatePresence>
                  {link.isActive && !toggleSidebar && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <AnimatePresence>
        {!toggleSidebar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100"
          >
            <motion.div
              whileHover={{ backgroundColor: '#f9fafb' }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-x-3 p-3 rounded-lg border border-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <span className="text-sm font-semibold text-white capitalize">{userEmail?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate capitalize">{userEmail?.split('@')[0]}</p>
                <p className="text-xs text-gray-500">{user?.isSuperUser ? 'Super Admin' : 'Admin'}</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Profile Indicator */}
      <AnimatePresence>
        {toggleSidebar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center relative">
              <span className="text-sm font-semibold text-white">X</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AdminNavigation
