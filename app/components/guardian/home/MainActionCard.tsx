import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Camera, Heart, PawPrint, Plus } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenPetDrawer } from '@/app/redux/features/petSlice'
import TokenCounter from '../TokenCounter'
import { petCreateTokenCost } from '@/app/lib/constants/public/token'

const MainActionCard = () => {
  const dispatch = useAppDispatch()

  return (
    <div className="space-y-8">
      {/* Main Setup Section */}
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <PawPrint className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Getting Started</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RosiePaws</h1>
              <p className="text-gray-600">
                Create your first pet profile to start tracking health, managing appointments, and organizing care.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch(setOpenPetDrawer())}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Pet Profile</span>
              <TokenCounter tokens={petCreateTokenCost} />
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Heart className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Health Tracking</h3>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-900">Monitor Wellness</p>
              <p className="text-sm text-gray-600">
                Track symptoms, medications, seizures, and daily health metrics for comprehensive care.
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Ready to use</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Appointments</h3>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-900">Schedule & Track</p>
              <p className="text-sm text-gray-600">
                Manage vet visits, set reminders, and keep detailed appointment records.
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Available after setup</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Camera className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Media Gallery</h3>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-900">Capture Moments</p>
              <p className="text-sm text-gray-600">
                Upload photos and videos to document your pet&apos;s journey and special moments.
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Photos & videos supported</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Next Steps</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-600 mt-1">Create pet profile</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600 mt-1">Add basic information</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600 mt-1">Start tracking care</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainActionCard
