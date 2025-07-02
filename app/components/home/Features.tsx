'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Droplets, Utensils, Zap, Heart, Calendar, BarChart3, Bell } from 'lucide-react'

const RosiePawsShowcase = () => {
  const [activeTab, setActiveTab] = useState('Pain Tracking')

  const tabs: string[] = [
    'Pain Tracking',
    'Water Intake',
    'Medication Management',
    'Appointments',
    'Emergency Care',
    'Feeding',
    'Blood Sugar Readings',
    'Seizure recordings'
  ]

  const showcaseData: any = {
    'Pain Tracking': {
      title: 'Advanced Pain Assessment',
      description: "Monitor your pet's comfort levels with comprehensive pain scoring tools and daily assessments.",
      features: [
        { icon: Activity, title: 'Pain Scoring', subtitle: 'Visual pain assessment scales' },
        { icon: Heart, title: 'Comfort Tracking', subtitle: 'Daily comfort level monitoring' },
        { icon: BarChart3, title: 'Pain Analytics', subtitle: 'Trend analysis and reports' },
        { icon: Bell, title: 'Pain Alerts', subtitle: 'Immediate notifications for concerns' }
      ]
    },
    'Water Intake': {
      title: 'Hydration Monitoring System',
      description: "Track your pet's water consumption patterns with smart hydration analytics and automated alerts.",
      features: [
        { icon: Droplets, title: 'Water Tracking', subtitle: 'Daily water consumption logs' },
        { icon: BarChart3, title: 'Hydration Analytics', subtitle: 'Water intake trend analysis' },
        { icon: Bell, title: 'Dehydration Alerts', subtitle: 'Low water intake notifications' },
        { icon: Activity, title: 'Health Correlation', subtitle: 'Link hydration to health metrics' }
      ]
    },
    'Medication Management': {
      title: 'Smart Medication Tracking',
      description: 'Never miss a dose with intelligent medication reminders and dosage tracking.',
      features: [
        { icon: Calendar, title: 'Med Schedule', subtitle: 'Automated dosing reminders' },
        { icon: Bell, title: 'Smart Alerts', subtitle: 'Customizable notifications' },
        { icon: BarChart3, title: 'Adherence Tracking', subtitle: 'Medication compliance reports' },
        { icon: Heart, title: 'Health Integration', subtitle: 'Sync with health metrics' }
      ]
    },
    Appointments: {
      title: 'Veterinary Appointment Management',
      description: 'Seamlessly schedule, track, and manage all veterinary appointments with automated reminders.',
      features: [
        { icon: Calendar, title: 'Appointment Scheduling', subtitle: 'Easy vet appointment booking' },
        { icon: Bell, title: 'Appointment Reminders', subtitle: 'Automated notification system' },
        { icon: Activity, title: 'Pre-Visit Prep', subtitle: 'Health summary preparation' },
        { icon: BarChart3, title: 'Visit History', subtitle: 'Complete appointment records' }
      ]
    },
    'Emergency Care': {
      title: 'Emergency Response System',
      description: 'Quick access to emergency protocols and real-time health monitoring for critical situations.',
      features: [
        { icon: Zap, title: 'Emergency Mode', subtitle: 'Instant emergency protocols' },
        { icon: Activity, title: 'Critical Monitoring', subtitle: 'Real-time vital signs' },
        { icon: Bell, title: 'Emergency Alerts', subtitle: 'Immediate notifications to vets' },
        { icon: Heart, title: 'Emergency Records', subtitle: 'Critical health information' }
      ]
    },
    Feeding: {
      title: 'Nutrition & Feeding Management',
      description: 'Track feeding schedules, portion control, and nutritional intake for optimal pet health.',
      features: [
        { icon: Utensils, title: 'Feeding Schedule', subtitle: 'Automated meal time tracking' },
        { icon: BarChart3, title: 'Nutrition Analytics', subtitle: 'Dietary pattern analysis' },
        { icon: Bell, title: 'Feeding Reminders', subtitle: 'Meal time notifications' },
        { icon: Activity, title: 'Weight Correlation', subtitle: 'Link feeding to weight changes' }
      ]
    },
    'Blood Sugar Readings': {
      title: 'Glucose Monitoring System',
      description: 'Monitor and track blood glucose levels for diabetic pets with comprehensive analytics.',
      features: [
        { icon: Activity, title: 'Glucose Tracking', subtitle: 'Blood sugar level monitoring' },
        { icon: BarChart3, title: 'Glucose Analytics', subtitle: 'Trend analysis and patterns' },
        { icon: Bell, title: 'Glucose Alerts', subtitle: 'High/low glucose notifications' },
        { icon: Calendar, title: 'Testing Schedule', subtitle: 'Automated testing reminders' }
      ]
    },
    'Seizure recordings': {
      title: 'Seizure Episode Tracking',
      description: 'Document and analyze seizure episodes with precise timing, duration, and severity tracking.',
      features: [
        { icon: Zap, title: 'Episode Recording', subtitle: 'Quick seizure documentation' },
        { icon: Activity, title: 'Seizure Analytics', subtitle: 'Frequency and pattern analysis' },
        { icon: BarChart3, title: 'Trigger Identification', subtitle: 'Potential trigger tracking' },
        { icon: Bell, title: 'Emergency Protocol', subtitle: 'Automated emergency responses' }
      ]
    }
  }

  const currentData: any = showcaseData[activeTab]

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Use Rosie Paws today for</h1>
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8 text-3xl font-bold justify-center"
              animate={{
                x: -(tabs.indexOf(activeTab) * 320) + (tabs.length - 1) * 160
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab
                      ? 'text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text scale-110'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                  whileHover={{ scale: activeTab === tab ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ minWidth: '280px' }}
                >
                  {tab}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Main Interface */}
        <motion.div
          className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Interface Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <span className="text-white font-semibold">Rosie Paws</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-purple-400 text-sm">{currentData.title}</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Description */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">{currentData.title}</h2>
                <p className="text-gray-400 leading-relaxed">{currentData.description}</p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                {currentData.features.map((feature: any, index: number) => {
                  const IconComponent = feature.icon
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <IconComponent size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.subtitle}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Visual Grid */}
            <div className="grid grid-cols-2 gap-4">
              {currentData.features.map((feature: any, index: number) => {
                const IconComponent = feature.icon
                return (
                  <motion.div
                    key={index}
                    className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 flex flex-col items-center justify-center border border-gray-600 hover:border-purple-500/50 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-center text-sm mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-xs text-center">{feature.subtitle}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RosiePawsShowcase
