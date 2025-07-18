'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AppointmentIcon,
  FeedingIcon,
  HeartIcon,
  HeartRateIcon,
  LightningIcon,
  PillIcon,
  WaterIcon
} from './SnapshotDashboardSVGs'

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <motion.path
      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C22.1 9 23 9.9 23 11C23 12.1 22.1 13 21 13C19.9 13 19 12.1 19 11C19 9.9 19.9 9 21 9ZM3 9C4.1 9 5 9.9 5 11C5 12.1 4.1 13 3 13C1.9 13 1 12.1 1 11C1 9.9 1.9 9 3 9ZM19.5 15.5C20.6 15.5 21.5 16.4 21.5 17.5C21.5 18.6 20.6 19.5 19.5 19.5C18.4 19.5 17.5 18.6 17.5 17.5C17.5 16.4 18.4 15.5 19.5 15.5ZM4.5 15.5C5.6 15.5 6.5 16.4 6.5 17.5C6.5 18.6 5.6 19.5 4.5 19.5C3.4 19.5 2.5 18.6 2.5 17.5C2.5 16.4 3.4 15.5 4.5 15.5ZM12 11C13.93 11 15.5 12.57 15.5 14.5C15.5 16.43 13.93 18 12 18C10.07 18 8.5 16.43 8.5 14.5C8.5 12.57 10.07 11 12 11Z"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
  </svg>
)

const SnapshotDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const metrics = [
    {
      icon: <HeartRateIcon />,
      value: '0/10',
      label: 'Pain Level',
      subtitle: 'Weekly avg: 4/10',
      color: 'bg-orange-500',
      delay: 0.1
    },
    {
      icon: <FeedingIcon />,
      value: '0',
      label: 'Feedings',
      subtitle: 'Last meal: None today',
      color: 'bg-green-500',
      delay: 0.2
    },
    {
      icon: <WaterIcon />,
      value: '0ml',
      label: 'Water Intake',
      subtitle: '0 drinks today',
      color: 'bg-blue-500',
      delay: 0.3
    },
    {
      icon: <PillIcon />,
      value: '5',
      label: 'Medications',
      subtitle: 'Total reminders: 3',
      color: 'bg-purple-500',
      delay: 0.4
    },
    {
      icon: <AppointmentIcon />,
      value: '5',
      label: 'Appointments',
      subtitle: 'Total reminders: 5',
      color: 'bg-pink-500',
      delay: 0.5
    },
    {
      icon: <HeartIcon />,
      value: 'No data',
      label: 'Blood Sugar',
      subtitle: 'Avg: 0 mg/dL • 0 readings today',
      color: 'bg-red-500',
      delay: 0.6
    },
    {
      icon: <LightningIcon />,
      value: '0',
      label: 'Seizures',
      subtitle: 'Last: 6/18/2025',
      color: 'bg-amber-400',
      delay: 0.7
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl -mt-60 mb-40 backdrop-blur-md rounded-3xl border-1 border-white overflow-hidden mx-auto relative z-50"
    >
      <div className="p-16">
        <div className="">
          {/* Browser Header */}
          <div className="bg-gray-100 rounded-tl-2xl rounded-tr-2xl px-4 py-3 flex items-center gap-2 border-b border-gray-200">
            <div className="flex gap-2">
              <motion.div className="w-3 h-3 bg-red-500 rounded-full" whileHover={{ scale: 1.2 }} />
              <motion.div className="w-3 h-3 bg-yellow-500 rounded-full" whileHover={{ scale: 1.2 }} />
              <motion.div className="w-3 h-3 bg-green-500 rounded-full" whileHover={{ scale: 1.2 }} />
            </div>
            <motion.div
              className="flex-1 bg-white rounded-md px-3 py-1 mx-4 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              rosiepawsapp.com
            </motion.div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <PawIcon />
              </motion.div>

              <div>
                <motion.h2
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Xyla&apos;s Health Dashboard
                </motion.h2>
                <motion.p
                  className="text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Sheepadoodle • Last updated{' '}
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </motion.p>
              </div>
            </div>

            {/* Metrics in Horizontal Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: metric.delay }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <motion.div
                      className={`${metric.color} rounded-full p-3 text-white`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      {metric.icon}
                    </motion.div>
                    <motion.span
                      className="text-gray-400 text-lg font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: metric.delay + 0.5 }}
                    >
                      —
                    </motion.span>
                  </div>

                  <motion.div
                    className="text-2xl font-semibold text-gray-800 mb-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: metric.delay + 0.3, type: 'spring' }}
                  >
                    {metric.value}
                  </motion.div>

                  <div className="text-gray-600 font-medium mb-1 text-sm">{metric.label}</div>

                  <motion.div
                    className="text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: metric.delay + 0.7 }}
                  >
                    {metric.subtitle}
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pain Level Trend */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-500 rounded-full p-2 text-white">
                    <HeartRateIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Pain Level Trend</h3>
                    <p className="text-sm text-gray-600">Last 7 days</p>
                  </div>
                </div>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[3, 5, 2, 6, 4, 3, 0].map((height, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-t from-orange-500 to-orange-300 rounded-t flex-1"
                      style={{ height: `${height * 15 + 10}%` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 1 + index * 0.1, type: 'spring' }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </motion.div>

              {/* Water Intake */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500 rounded-full p-2 text-white">
                    <WaterIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Water Intake</h3>
                    <p className="text-sm text-gray-600">Daily goal: 800ml</p>
                  </div>
                </div>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[400, 600, 350, 750, 500, 420, 0].map((height, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t flex-1"
                      style={{ height: `${(height / 800) * 100}%` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 1.2 + index * 0.1, type: 'spring' }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </motion.div>

              {/* Blood Sugar Levels */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-500 rounded-full p-2 text-white">
                    <HeartIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Blood Sugar Levels</h3>
                    <p className="text-sm text-gray-600">Target range: 80-120 mg/dL</p>
                  </div>
                </div>
                <div className="h-40 relative">
                  {/* Target range background */}

                  <div className="h-full flex items-end justify-between gap-2">
                    {[95, 110, 85, 130, 105, 88, 0].map((value, index) => {
                      const height = value > 0 ? (value / 150) * 100 : 5
                      const isInRange = value >= 80 && value <= 120
                      return (
                        <motion.div
                          key={index}
                          className={`rounded-t flex-1 ${
                            value === 0
                              ? 'bg-gray-200'
                              : isInRange
                                ? 'bg-gradient-to-t from-green-500 to-green-300'
                                : 'bg-gradient-to-t from-red-500 to-red-300'
                          }`}
                          style={{ height: `${height}%` }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 1.4 + index * 0.1, type: 'spring' }}
                        />
                      )
                    })}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </motion.div>

              {/* Feeding Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500 rounded-full p-2 text-white">
                    <FeedingIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Weekly Feeding</h3>
                    <p className="text-sm text-gray-600">Meals per day</p>
                  </div>
                </div>
                <div className="h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Circular progress for each day */}
                    {[2, 3, 2, 3, 2, 3, 0].map((meals, index) => {
                      const angle = index * 51.43 - 90 // 360/7 = 51.43 degrees per day
                      const x = 50 + 35 * Math.cos((angle * Math.PI) / 180)
                      const y = 50 + 35 * Math.sin((angle * Math.PI) / 180)
                      const radius = meals * 3 + 3

                      return (
                        <motion.circle
                          key={index}
                          cx={x}
                          cy={y}
                          r={radius}
                          className={meals > 0 ? 'fill-green-400' : 'fill-gray-200'}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.6 + index * 0.1, type: 'spring' }}
                        />
                      )
                    })}
                    <text x="50" y="55" textAnchor="middle" className="text-lg font-semibold fill-gray-700">
                      15
                    </text>
                    <text x="50" y="68" textAnchor="middle" className="text-[8px] fill-gray-500">
                      Total meals
                    </text>
                  </svg>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">This week&apos;s feeding pattern</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SnapshotDashboard
