import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Bell, Camera, PawPrint } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenPetDrawer } from '@/app/redux/features/petSlice'
import TokenCounter from '../TokenCounter'
import { petCreateTokenCost } from '@/app/lib/constants/token'

const MainActionCard = () => {
  const dispatch = useAppDispatch()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="rounded-2xl shadow-lg border border-gray-100 bg-white">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                <PawPrint className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Get Started</h2>
                <p className="text-sm text-gray-600">Add your first pet to unlock all features</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Required
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 mb-3"
            >
              Add Your First Pet
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-lg mx-auto leading-relaxed"
            >
              Setup a profile for your pet to start tracking their health, uploading photos, and managing their care.
            </motion.p>
          </div>

          {/* Prominent circular button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.button
              onClick={() => dispatch(setOpenPetDrawer())}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 0 }}
              className="relative w-24 h-24 bg-gradient-to-b from-pink-400 via-red-500 to-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group border-2 border-pink-300"
              style={{
                boxShadow:
                  '0 8px 16px rgba(236, 72, 153, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Top highlight for 3D effect */}
              <div className="absolute inset-2 bg-gradient-to-b from-white/40 to-transparent rounded-full pointer-events-none" />

              {/* Pressed state shadow */}
              <div className="absolute inset-0 bg-gradient-to-b from-pink-600 via-red-700 to-orange-800 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-100" />

              {/* Icon container */}
              <div className="relative flex items-center justify-center w-full h-full">
                <PawPrint className="w-8 h-8 text-white drop-shadow-sm" />
              </div>

              {/* Bottom shadow for depth */}
              <div
                className="absolute -bottom-2 left-2 right-2 h-4 bg-pink-600/30 rounded-full blur-sm -z-10"
                style={{ transform: 'scaleY(0.3)' }}
              />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <p className="text-sm text-gray-600">Start here to begin your pet&apos;s health journey</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <TokenCounter color1="#ef4444" color2="#ec4899" id="redToPink" tokens={petCreateTokenCost} />
                <span className="text-xs text-gray-500">tokens required</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="text-center p-4 opacity-60">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Health Tracking</h4>
              <p className="text-sm text-gray-600">Monitor daily activities and symptoms</p>
            </div>
            <div className="text-center p-4 opacity-60">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Photo Gallery</h4>
              <p className="text-sm text-gray-600">Upload and organize photos and videos</p>
            </div>
            <div className="text-center p-4 opacity-60">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Care Reminders</h4>
              <p className="text-sm text-gray-600">Schedule and track appointments</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default MainActionCard
