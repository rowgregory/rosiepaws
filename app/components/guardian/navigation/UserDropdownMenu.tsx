import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Settings, LogOut } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setOpenPetDrawer } from '@/app/redux/features/petSlice'
import { signOut } from 'next-auth/react'
import { setAuthState } from '@/app/redux/features/authSlice'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { setCloseUserDropdown } from '@/app/redux/features/appSlice'

const handleSignOut = async (dispatch: any) => {
  try {
    // 1. Clear app state
    dispatch(setAuthState({ isAuthenticated: false, id: '', role: '' }))
    localStorage.clear()

    // 2. NextAuth signOut
    await signOut({ redirect: false })

    // 3. Manual cookie cleanup
    const authCookies = ['authjs.csrf-token', 'authjs.session-token', 'authjs.callback-url']

    authCookies.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
    })

    // 4. Force complete page reload
    window.location.href = '/auth/login'
  } catch {
    window.location.href = '/auth/login'
  }
}

const UserDropdownMenu = () => {
  const { userDropdown } = useAppSelector((state: RootState) => state.app)
  const { user } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()
  const { push } = useRouter()

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        dispatch(setCloseUserDropdown())
        push('/guardian/settings')
      },
      className: 'hover:bg-gray-50'
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: () => handleSignOut(dispatch),
      className: 'hover:bg-gray-50'
    }
  ]

  const dropdownVariants: any = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.15 }
    }
  }

  const staggerChildren: any = {
    visible: {
      transition: {
        staggerChildren: 0.03
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      {userDropdown && (
        <motion.div
          className="absolute top-full mx-auto w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* User Info Section */}
          <motion.div className="border-b border-gray-100 flex flex-col" variants={itemVariants}>
            <div className="px-3 my-2 py-1.5 flex items-center gap-3">
              <Image
                src={user.image!}
                className="min-w-8 w-8 h-8 bg-gray-100 rounded-full object-cover"
                priority={false}
                width="0"
                height="0"
                alt="Rosie Paws"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-12 font-medium text-gray-900 truncate">{user.name}</p>
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                </div>
                <p className="text-12 text-gray-500">{user.role}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
              onClick={() => dispatch(setOpenPetDrawer())}
              className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-gray-700 transition-colors duration-150"
            >
              <div className="flex items-center justify-center min-w-8 w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full">
                <div className="flex items-center justify-center bg-white w-7 h-7 rounded-full">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
              <div className="text-12">Add Pet</div>
            </motion.button>
          </motion.div>

          {/* Menu Items */}
          <motion.div variants={staggerChildren} initial="hidden" animate="visible">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <motion.button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-150 ${item.className}`}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent className="w-6 h-6 text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Email Section */}
          <motion.div className="px-3 py-2 border-t border-gray-100 mt-1" variants={itemVariants}>
            <p className="text-xs text-gray-500 truncate text-center">{user.email}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UserDropdownMenu
