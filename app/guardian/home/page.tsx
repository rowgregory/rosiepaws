'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  Phone,
  CheckCircle,
  Pill,
  Utensils,
  Activity,
  Camera,
  FileText,
  Clock,
  AlertTriangle,
  ArrowRight,
  Bell
} from 'lucide-react'
import EmergencySignsDrawer from '@/app/drawers/EmergencySignsDrawer'
import MainActionCard from '@/app/components/guardian/home/MainActionCard'
import ComingSoonPreviewCards from '@/app/components/guardian/home/ComingSoonPreviewCards'
import CareResourcesAndInfo from '@/app/components/guardian/home/CareResourcesAndInfo'
import SupportSection from '@/app/components/guardian/home/SupportSection'
import Support24Drawer from '@/app/drawers/Support24Drawer'
import DisabilityEndOfLifeCareDrawer from '@/app/drawers/DisabilityEndOfLifeCareDrawer'
import ViewGuideDrawer from '@/app/drawers/ViewGuideDrawer'
import CreateSupportDrawer from '@/app/drawers/ContactSupportDrawer'
import { RootState, useAppSelector } from '@/app/redux/store'

const Home = () => {
  const [currentTime] = useState(new Date())
  const { zeroPets } = useAppSelector((state: RootState) => state.pet)

  // Mock data - replace with real data from your app
  const todaysTasks = [
    { id: 1, type: 'medication', title: 'Pain medication for Buddy', time: '2:00 PM', completed: false, urgent: true },
    { id: 2, type: 'feeding', title: 'Lunch for Luna', time: '12:30 PM', completed: true, urgent: false },
    { id: 3, type: 'appointment', title: 'Vet check-up - Buddy', time: '4:30 PM', completed: false, urgent: false },
    { id: 4, type: 'comfort', title: 'Comfort check for Luna', time: '6:00 PM', completed: false, urgent: false }
  ]

  const quickActions = [
    { icon: <Pill className="w-5 h-5" />, label: 'Log Medication', color: 'from-blue-500 to-blue-600' },
    { icon: <Utensils className="w-5 h-5" />, label: 'Record Feeding', color: 'from-green-500 to-green-600' },
    { icon: <Activity className="w-5 h-5" />, label: 'Quality Check', color: 'from-purple-500 to-purple-600' },
    { icon: <FileText className="w-5 h-5" />, label: 'Add Note', color: 'from-orange-500 to-orange-600' },
    { icon: <Camera className="w-5 h-5" />, label: 'Photo Memory', color: 'from-pink-500 to-pink-600' },
    { icon: <Phone className="w-5 h-5" />, label: 'Call Vet', color: 'from-red-500 to-red-600' }
  ]

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-5 h-5" />
      case 'feeding':
        return <Utensils className="w-5 h-5" />
      case 'appointment':
        return <Calendar className="w-5 h-5" />
      case 'comfort':
        return <Heart className="w-5 h-5" />
      default:
        return <CheckCircle className="w-5 h-5" />
    }
  }

  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  return (
    <>
      <EmergencySignsDrawer />
      <Support24Drawer />
      <DisabilityEndOfLifeCareDrawer />
      <ViewGuideDrawer />
      <CreateSupportDrawer />
      <div className="px-6 py-5 max-w-7xl mx-auto bg-gray-50">
        {zeroPets ? (
          <>
            <MainActionCard />
            <ComingSoonPreviewCards />
          </>
        ) : (
          <>
            {/* Welcome Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Good {getTimeOfDay()}!</h1>
              <p className="text-gray-600">Here&apos;s what needs your attention today.</p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Tasks */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-rose-500" />
                      Today&apos;s Care Tasks
                    </h2>
                    <span className="text-sm text-gray-500">
                      {todaysTasks.filter((t) => !t.completed).length} remaining
                    </span>
                  </div>

                  <div className="space-y-3">
                    {todaysTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-50 border-green-200'
                            : task.urgent
                              ? 'bg-red-50 border-red-200 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:border-rose-200'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg mr-4 ${
                            task.completed ? 'bg-green-500' : task.urgent ? 'bg-red-500' : 'bg-rose-500'
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <div className="text-white">{getTaskIcon(task.type)}</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${task.completed ? 'text-green-700 line-through' : 'text-gray-800'}`}
                          >
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {task.time}
                            {task.urgent && !task.completed && (
                              <span className="ml-2 inline-flex items-center">
                                <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                                <span className="text-red-600 font-medium">Urgent</span>
                              </span>
                            )}
                          </p>
                        </div>
                        {!task.completed && (
                          <button className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                            Mark Done
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <ArrowRight className="w-5 h-5 mr-2 text-rose-500" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                      >
                        <div className="flex flex-col items-center text-center">
                          {action.icon}
                          <span className="text-sm font-medium mt-2">{action.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upcoming Reminders */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-rose-500" />
                    Upcoming
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-800">Vet Visit</p>
                        <p className="text-sm text-blue-600">Tomorrow 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <Pill className="w-4 h-4 text-purple-600 mr-3" />
                      <div>
                        <p className="font-medium text-purple-800">Medication Refill</p>
                        <p className="text-sm text-purple-600">In 3 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Care Resources & Information */}
        <CareResourcesAndInfo />

        {/* Support Section */}
        <SupportSection />
      </div>
    </>
  )
}

export default Home
