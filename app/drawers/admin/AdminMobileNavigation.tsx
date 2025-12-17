import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAdminSelector, useAppDispatch, useUserSelector } from '@/app/redux/store'
import { setCloseAdminMobileNavigation } from '@/app/redux/features/adminSlice'
import { X } from 'lucide-react'
import { adminNavigationLinks } from '@/app/lib/utils'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const AdminMobileNavigation = () => {
  const { adminMobileNavigation } = useAdminSelector()
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseAdminMobileNavigation())
  const path = useCustomPathname()
  const { user } = useUserSelector()
  const isSuperUser = user?.isSuperUser ?? false
  const linkData = adminNavigationLinks(path, isSuperUser)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    setIsLoading(true)
    await signOut({ callbackUrl: '/auth/login' })
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: any) => {
    if (link.textKey === 'Logout') {
      handleLogout(e)
    } else {
      onClose() // Close drawer when navigating
    }
  }

  return (
    <AnimatePresence>
      {adminMobileNavigation && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-20 z-[90]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[100] overflow-hidden flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm uppercase">{user?.email?.charAt(0)}</span>
                </div>
                <span className="font-semibold text-gray-900">Menu</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="px-4 py-6 space-y-2">
                {linkData.map((link, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.linkKey}
                      onClick={(e) => handleLinkClick(e, link)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        link.isActive
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                        {isLoading && link.textKey === 'Logout' ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
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

                      {/* Text */}
                      <span className="text-base font-medium flex-1">{link.textKey}</span>

                      {/* Active indicator */}
                      {link.isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-2 h-2 bg-white rounded-full flex-shrink-0"
                        />
                      )}

                      {/* Arrow for non-logout items */}
                      {link.textKey !== 'Logout' && (
                        <motion.div
                          className={`transition-colors duration-200 ${
                            link.isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                          whileHover={{ x: 2 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">© {new Date().getFullYear()} Rosie Paws</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AdminMobileNavigation
