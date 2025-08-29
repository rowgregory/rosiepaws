'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, usePetSelector } from '@/app/redux/store'
import { setCloseGuardianActionMenu } from '@/app/redux/features/petSlice'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { publicDashboardLinks } from '@/app/lib/utils'

import useCustomPathname from '@/app/hooks/useCustomPathname'

const GuardianActionMenu = () => {
  const { guardianActionMenu, zeroPets } = usePetSelector()
  const dispatch = useAppDispatch()
  const path = useCustomPathname()

  const onClose = () => dispatch(setCloseGuardianActionMenu())

  const linkData = publicDashboardLinks(path, zeroPets)

  return (
    <AnimatePresence>
      {guardianActionMenu && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed left-6 top-16 w-64 lg:w-80 origin-top-right bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4 bg-gradient-to-r from-pink-50 to-orange-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-orange-600 rounded-xl">
                  <Menu onClick={onClose} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                  <p className="text-sm text-gray-600">Quick access to all features</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {linkData.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.linkKey}
                    onClick={onClose}
                    className={`group relative w-full flex items-center justify-between space-x-4 p-4 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] border hover:border-gray-200 ${link.isActive ? 'border border-gray-200 shadow-md' : 'border-transparent'}`}
                  >
                    <div className="flex items-center gap-x-3">
                      {/* Icon */}
                      <div className={`relative p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <link.icon className={`w-5 h-5 transition-colors duration-200 `} />
                      </div>

                      <AnimatePresence>
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`text-sm font-medium whitespace-nowrap`}
                        >
                          {link.textKey}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    {/* Arrow indicator */}
                    <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 pt-2 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">Track your pet&apos;s health with ease</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default GuardianActionMenu
