import { IUser } from '@/app/types'
import { AnimatePresence, motion } from 'framer-motion'
import React, { FC } from 'react'

const BottomProfileSection: FC<{ navigation: boolean; user: IUser | null }> = ({ navigation, user }) => {
  return (
    <AnimatePresence>
      {!navigation && (
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
              <span className="text-sm font-semibold text-white capitalize">{user?.email?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate capitalize">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500">{user?.isSuperUser ? 'Super Admin' : 'Admin'}</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BottomProfileSection
