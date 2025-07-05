'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  Clock,
  Bell,
  BookOpen,
  Phone,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Pill,
  Utensils,
  Activity,
  Camera,
  Users,
  FileText
} from 'lucide-react'
import { setOpenEmergencySignsDrawer } from '@/app/redux/features/dashboardSlice'
import { useAppDispatch } from '@/app/redux/store'
import EmergencySignsDrawer from '@/app/drawers/EmergencySignsDrawer'

const Home = () => {
  const dispatch = useAppDispatch()
  const [currentTime] = useState(new Date())

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
      <div className="">
        <div className="">
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

          {/* Care Resources & Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-rose-500" />
              Care Resources & Expert Guidance
            </h2>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Dr. Jaci Coble&apos;s Professional Guides</h3>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  You&apos;ll get 2 free eBooks personally written by Sea Legs&apos; veterinarian—who specializes in
                  palliative and rehabilitative pet care—to help guide end-of-life pet decisions. Paid plans include
                  more eBooks depending on your chosen tier.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.a
                  href="https://vet-ebooks.com/comfort-care-at-home"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="group block"
                >
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                        62 Pages • PDF
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors truncate">
                      Comfort Care at Home: A Complete Guide
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Expert strategies for creating the optimal home environment, managing pain, and providing
                      compassionate end-of-life care for dogs and cats.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Dr. Jaci Coble, DVM</span>
                      <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>

                <motion.a
                  href="https://vet-ebooks.com/quality-of-life-assessment"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="group block"
                >
                  <div className="bg-gradient-to-br from-slate-50 to-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm text-emerald-600 font-medium bg-emerald-100 px-3 py-1 rounded-full">
                        48 Pages • PDF
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors">
                      Quality of Life Assessment Tools
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Scientific frameworks and practical scales to objectively evaluate your pet&apos;s daily comfort,
                      mobility, and overall wellbeing.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Dr. Jaci Coble, DVM</span>
                      <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                  <FileText className="w-4 h-4 mr-2" />
                  All eBooks are professionally authored and peer-reviewed
                </div>
              </div>
            </div>

            {/* Care Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dog Care Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🐕</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Dog Care Essentials</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 hover:border-amber-200 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-amber-900 mb-2">Senior Dog Nutrition</h4>
                    <p className="text-amber-700 text-sm">
                      Specialized dietary needs for aging dogs and appetite stimulation techniques
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-orange-900 mb-2">Mobility Support</h4>
                    <p className="text-orange-700 text-sm">
                      Helping dogs with arthritis and mobility issues stay comfortable
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 hover:border-red-200 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-red-900 mb-2">Breathing & Heart Health</h4>
                    <p className="text-red-700 text-sm">Managing respiratory and cardiac conditions in senior dogs</p>
                  </div>
                </div>
              </motion.div>

              {/* Cat Care Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🐱</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Cat Care Essentials</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-purple-900 mb-2">Kidney Disease Management</h4>
                    <p className="text-purple-700 text-sm">
                      Supporting cats with chronic kidney disease through diet and care
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl border border-pink-100 hover:border-pink-200 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-pink-900 mb-2">Stress Reduction</h4>
                    <p className="text-pink-700 text-sm">
                      Creating calm environments and reducing anxiety in sick cats
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 hover:border-rose-200 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-rose-900 mb-2">Hydration & Appetite</h4>
                    <p className="text-rose-700 text-sm">
                      Encouraging eating and drinking in cats who are losing interest
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Emergency & Support Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 mr-3" />
                  <h3 className="text-lg font-bold">Emergency Signs</h3>
                </div>
                <p className="text-red-100 mb-4">Know when to seek immediate veterinary care</p>
                <button
                  onClick={() => dispatch(setOpenEmergencySignsDrawer())}
                  className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  View Guide
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <Phone className="w-8 h-8 mr-3" />
                  <h3 className="text-lg font-bold">24/7 Support</h3>
                </div>
                <p className="text-blue-100 mb-4">Connect with veterinary professionals anytime</p>
                <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                  Get Help
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 mr-3" />
                  <h3 className="text-lg font-bold">Support Groups</h3>
                </div>
                <p className="text-green-100 mb-4">Connect with other caring pet parents</p>
                <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                  Join Community
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Home
