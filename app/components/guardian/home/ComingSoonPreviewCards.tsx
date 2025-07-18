import React from 'react'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, Bell, Calendar, Clock, FileText, Heart, Pill, TrendingUp } from 'lucide-react'

const ComingSoonPreviewCards = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What&apos;s Available After Setup</h2>
        <p className="text-gray-600">Here&apos;s what you&apos;ll have access to once you add your pet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 opacity-60"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-rose-500" />
              Today&apos;s Care Tasks
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="p-2 rounded-lg mr-4 bg-gray-300">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-600">Morning Medication</h4>
                <p className="text-sm text-gray-500">Schedule and track daily care</p>
              </div>
            </div>
            <div className="flex items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="p-2 rounded-lg mr-4 bg-gray-300">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-600">Health Check</h4>
                <p className="text-sm text-gray-500">Monitor daily symptoms</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 opacity-60"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-rose-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gray-100 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Track Health</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Schedule</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Records</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Reports</span>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Reminders Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 opacity-60"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-rose-500" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-600">Vet Appointments</p>
                <p className="text-sm text-gray-500">Never miss important visits</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Pill className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-600">Medication Refills</p>
                <p className="text-sm text-gray-500">Stay ahead of prescriptions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ComingSoonPreviewCards
