'use client'

import React from 'react'
import { motion } from 'framer-motion'

const rosiePawsFeatures = [
  {
    title: 'Health Monitoring',
    subtitle: 'Track vital signs, symptoms, and daily wellness metrics with real-time health dashboards for your pet.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M22 12h-4l-3 9L9 3l-3 9H2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    title: 'Smart Reminders',
    subtitle:
      'Never miss medication times, feeding schedules, or vet appointments with intelligent notification system.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'Health Records Storage',
    subtitle:
      'Maintain comprehensive digital health records including vaccinations, medications, and vet visit history.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="14,2 14,8 20,8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'Emergency Information',
    subtitle:
      'Store critical emergency contacts, veterinary information, and important medical details for quick access.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'Multi-Pet Management',
    subtitle: 'Manage health records for multiple pets in one unified dashboard with individual profiles and tracking.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    title: 'Health Analytics',
    subtitle:
      "Visualize health trends and patterns with interactive charts and graphs to monitor your pet's wellbeing over time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 9l1.5-1.5L14 11l5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="14" cy="11" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'Medication Tracking',
    subtitle: 'Keep detailed logs of medications, dosages, and treatment schedules with easy-to-use tracking tools.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="8" y="10" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="9" y="7" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="10" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="15" x2="14" y2="15" stroke="currentColor" strokeWidth="1" />
        <path d="M11 3h2v4h-2zM9 5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'User-Friendly Interface',
    subtitle: "Access your pet's complete health dashboard anywhere with our intuitive and responsive web application.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M2 8h20" stroke="currentColor" strokeWidth="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="9" cy="6" r="1" fill="currentColor" />
        <circle cx="12" cy="6" r="1" fill="currentColor" />
      </svg>
    )
  }
]

const FeatureCard = ({ feature, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-200 group cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      {/* Icon */}
      <motion.div
        className="bg-gray-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 text-gray-600 group-hover:text-white group-hover:bg-gradient-to-t group-hover:from-pink-400 group-hover:via-orange-400 group-hover:to-red-400 transition-colors duration-300"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.3 }
        }}
      >
        {feature.icon}
      </motion.div>

      {/* Content */}
      <motion.h3
        className="text-lg font-semibold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        {feature.title}
      </motion.h3>

      <motion.p
        className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        {feature.subtitle}
      </motion.p>
    </motion.div>
  )
}

const Features = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What Rosie Paws Does
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Comprehensive pet health management tools designed to keep your furry friends happy, healthy, and thriving.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {rosiePawsFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started with Rosie Paws
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Features
