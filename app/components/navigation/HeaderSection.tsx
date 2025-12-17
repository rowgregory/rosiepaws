import { IUser } from '@/app/types'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { FC } from 'react'

interface IHeaderSection {
  toggleSidebar: boolean
  user: IUser | null
  title: string
  loading: boolean
}

const HeaderSection: FC<IHeaderSection> = ({ toggleSidebar, user, title, loading }) => {
  return (
    <Link
      href="/"
      className={`relative h-16 flex items-center border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
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
              {loading ? (
                <div className="border-2 border-pink-500 border-t-0 rounded-full animate-spin w-4 h-4" />
              ) : (
                <span className="text-white font-bold text-sm uppercase">{user?.email?.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{title} Panel</h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed-header"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center"
          >
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              {loading ? (
                <div className="border-2 border-pink-500 border-t-0 rounded-full animate-spin w-4 h-4" />
              ) : (
                <span className="text-white font-bold uppercase">{user?.email?.charAt(0)}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  )
}

export default HeaderSection
