'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AppointmentIcon,
  FeedingIcon,
  HeartIcon,
  HeartRateIcon,
  LightningIcon,
  MovementIcon,
  PillIcon,
  VitalSignsIcon,
  WaterIcon
} from './SnapshotDashboardSVGs'

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
      value: '2/4',
      label: 'Pain Level',
      subtitle: 'Weekly avg: 1/4',
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
      icon: <VitalSignsIcon />,
      value: '120/80',
      label: 'Vital Signs',
      subtitle: '2 readings today',
      color: 'bg-cyan-500',
      delay: 0.4
    },
    {
      icon: <MovementIcon />,
      value: '3mi',
      label: 'Movements',
      subtitle: '4 walks today',
      color: 'bg-gray-500',
      delay: 0.5
    },
    {
      icon: <PillIcon />,
      value: '5',
      label: 'Medications',
      subtitle: 'Total reminders: 3',
      color: 'bg-purple-500',
      delay: 0.6
    },
    {
      icon: <AppointmentIcon />,
      value: '5',
      label: 'Appointments',
      subtitle: 'Total reminders: 5',
      color: 'bg-pink-500',
      delay: 0.7
    },
    {
      icon: <HeartIcon />,
      value: '120mg/dL',
      label: 'Blood Sugar',
      subtitle: 'Avg: 100 mg/dL',
      color: 'bg-red-500',
      delay: 0.8
    },
    {
      icon: <LightningIcon />,
      value: '0',
      label: 'Seizures',
      subtitle: 'Last: 6/18/2025',
      color: 'bg-amber-400',
      delay: 0.9
    }
  ]

  return (
    <div className="px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-screen-2xl -mt-24 sm:-mt-60 backdrop-blur-md rounded-3xl border-1 border-white overflow-hidden mx-auto relative z-50"
      >
        <div className="p-4 sm:p-16">
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
              <div className="flex flex-1 items-center gap-3 mb-6">
                <motion.div
                  className="bg-gradient-to-br text-white from-purple-500 to-purple-600 rounded-xl p-3"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  X
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
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-9 gap-4 mb-6">
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
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SnapshotDashboard
