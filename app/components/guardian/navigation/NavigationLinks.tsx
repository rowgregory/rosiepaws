import useCustomPathname from '@/app/hooks/useCustomPathname'
import { publicDashboardLinks } from '@/app/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'

const NavigationLinks: FC<{ zeroPets: boolean; toggleSidebar: boolean }> = ({ zeroPets, toggleSidebar }) => {
  const path = useCustomPathname()
  const [isLoading, setIsLoading] = useState(false)
  const { push } = useRouter()

  const linkData = publicDashboardLinks(path, zeroPets)

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await signOut({
        redirect: false, // Prevent automatic redirect
        callbackUrl: '/auth/login' // Optional: specify where to redirect after signout
      })

      push('/auth/login')
      setIsLoading(false)
    } catch {}
  }

  return (
    <div className="pb-4">
      <nav className={`px-3 space-y-1 ${toggleSidebar ? 'flex flex-col items-center' : ''}`}>
        {linkData.map((link, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              href={link.linkKey}
              onClick={(e) => (link.textKey === 'Logout' ? handleLogout(e) : {})}
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
  )
}

export default NavigationLinks
