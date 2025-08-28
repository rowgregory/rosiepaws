'use client'

import React from 'react'
import { motion } from 'framer-motion'

const AnnouncementBanner = () => {
  return (
    <div className="flex items-center justify-center p-4 mt-12 md:mt-20">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: 'backOut'
              }}
              className="flex-shrink-0"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-400 via-pink-400 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm md:text-lg text-white">RP</span>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex-1"
            >
              <p className="text-sm md:text-base font-medium text-gray-800 leading-relaxed">
                A gentle, data-driven way to track end-of-life milestones for beloved dogs and cats, because every story
                matters.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-pink-400/10 to-orange-400/10 rounded-2xl blur-xl -z-10"
        />
      </motion.div>
    </div>
  )
}

export default AnnouncementBanner
