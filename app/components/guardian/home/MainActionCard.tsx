import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Calendar, Camera, PawPrint } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenPetDrawer } from '@/app/redux/features/petSlice'
import TokenCounter from '../TokenCounter'
import { petCreateTokenCost } from '@/app/lib/constants/public/token'

const MainActionCard = () => {
  const dispatch = useAppDispatch()

  return (
    <div className="space-y-8">
      {/* Main Setup Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg border border-slate-200 shadow-sm"
      >
        <div className="p-8 text-centerf flex items-center flex-col">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <PawPrint className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">Add Your First Pet</h1>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto text-center">
            Create a profile to start tracking health, managing appointments, and organizing your pet&apos;s care.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch(setOpenPetDrawer())}
            className="w-fit flex items-center justify-center gap-x-2 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 px-4 py-2 rounded-full text-white"
          >
            <p>Log pet</p> <TokenCounter tokens={petCreateTokenCost} />
          </motion.button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Health Tracking */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Health Tracking</h3>
          <p className="text-slate-600 text-sm mb-4">
            Monitor symptoms, track medications, and log daily activities for comprehensive health insights.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm text-slate-700">Daily symptom logging</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm text-slate-700">Medication reminders</span>
            </div>
          </div>
        </div>

        {/* Photo Management */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Photo Gallery</h3>
          <p className="text-slate-600 text-sm mb-4">
            Upload and share photos of your pet with the Rosie Paws community.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-sm text-slate-700">Smart photo organization</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-sm text-slate-700">Share with family & vets</span>
            </div>
          </div>
        </div>

        {/* Appointment Scheduling */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm md:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Scheduling</h3>
          <p className="text-slate-600 text-sm mb-4">
            Never miss important appointments with automated reminders and calendar integration.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-slate-700">Vet appointment tracking</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-slate-700">Vaccination schedules</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MainActionCard
