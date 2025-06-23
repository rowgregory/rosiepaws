'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import {
  setCloseGuardianActionMenu,
  setOpenBloodSugarDrawer,
  setOpenFeedingDrawer,
  setOpenMedicationDrawer,
  setOpenPainScoreDrawer,
  setOpenPetDrawer,
  setOpenSeizureDrawer,
  setOpenWaterDrawer
} from '@/app/redux/features/petSlice'
import Link from 'next/link'
import { Utensils, Pill, Heart, Sparkles, Crown, Zap, Activity, Droplets } from 'lucide-react'
import { getTodaysBloodSugarLogs } from '@/app/forms/blood-sugar-form/constants'

const actions = (hasReachedBloodSugarLimit: boolean, todaysBloodSugarLogs: any) => [
  {
    label: 'Pet',
    linkKey: '/guardian/pets/list',
    func: setOpenPetDrawer,
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    bgHover: 'hover:bg-purple-50',
    description: 'Manage your pets'
  },
  {
    label: 'Pain Score',
    linkKey: '/guardian/pets/pain',
    func: setOpenPainScoreDrawer,
    icon: Activity,
    color: 'from-red-500 to-orange-500',
    bgHover: 'hover:bg-red-50',
    description: 'Track pain levels'
  },
  {
    label: 'Feedings',
    linkKey: '/guardian/pets/feedings',
    func: setOpenFeedingDrawer,
    icon: Utensils,
    color: 'from-green-500 to-emerald-500',
    bgHover: 'hover:bg-green-50',
    description: 'Log meals & treats'
  },
  {
    label: 'Water Intake',
    linkKey: '/guardian/pets/water',
    func: setOpenWaterDrawer,
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    bgHover: 'hover:bg-blue-50',
    description: 'Monitor hydration'
  },
  {
    label: 'Medication',
    linkKey: '/guardian/pets/medication',
    func: setOpenMedicationDrawer,
    icon: Pill,
    color: 'from-indigo-500 to-purple-500',
    bgHover: 'hover:bg-purple-50',
    description: 'Medicine schedule'
  },
  {
    label: hasReachedBloodSugarLimit ? 'Blood Sugar (Limit Reached)' : 'Blood Sugar',
    linkKey: '#', // Use # since we're handling click differently
    func: !hasReachedBloodSugarLimit ? setOpenBloodSugarDrawer : () => ({ type: '', payload: '' }),
    icon: Heart,
    color: hasReachedBloodSugarLimit ? 'from-gray-400 to-gray-500' : 'from-pink-500 to-rose-500',
    bgHover: hasReachedBloodSugarLimit ? 'hover:bg-gray-50' : 'hover:bg-pink-50',
    description: hasReachedBloodSugarLimit
      ? `Daily limit reached (${todaysBloodSugarLogs.length}/4)`
      : 'Log blood glucose readings',
    isPremium: true,
    isDisabled: hasReachedBloodSugarLimit
  },
  {
    label: 'Seizure Tracking',
    linkKey: '/guardian/pets/seizure',
    func: setOpenSeizureDrawer,
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgHover: 'hover:bg-yellow-50',
    description: 'Track seizure activity',
    isPremium: true
  }
]

const GuardianActionMenu = () => {
  const { guardianActionMenu, bloodSugars } = useAppSelector((state: RootState) => state.pet)
  const dispatch = useAppDispatch()

  const onClose = () => dispatch(setCloseGuardianActionMenu())

  // Calculate today's blood sugar logs
  const todaysBloodSugarLogs = getTodaysBloodSugarLogs(bloodSugars || [])
  const hasReachedBloodSugarLimit = todaysBloodSugarLogs.length >= 4

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
            className="fixed right-6 top-16 w-80 origin-top-right bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Pet Care Actions</h3>
                  <p className="text-sm text-gray-600">Choose what you&apos;d like to track</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {actions(hasReachedBloodSugarLimit, todaysBloodSugarLogs).map(
                ({ label, linkKey, func, icon: Icon, color, bgHover, description, isPremium }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={linkKey}
                      onClick={() => {
                        onClose()
                        dispatch(func())
                      }}
                      className={`group relative w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${bgHover} hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-gray-200`}
                    >
                      {/* Icon */}
                      <div
                        className={`relative p-3 bg-gradient-to-r ${color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                        {isPremium && (
                          <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full">
                            <Crown className="w-3 h-3 text-yellow-800" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                            {label}
                          </h4>
                          {isPremium && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs font-bold rounded-full">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          {description}
                        </p>
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
                )
              )}
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
