'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const Audience = () => {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const cards = [
    {
      title: 'For Pet Owners',
      description:
        "Monitor your pet's health with comprehensive tracking tools for pain, feeding, hydration, and vital signs. Keep detailed records and never miss important care milestones."
    },
    {
      title: 'For Families',
      description:
        'Share pet care responsibilities seamlessly across family members. Coordinate feeding schedules, medication reminders, and health updates in real-time collaboration.'
    },
    {
      title: 'For Veterinarians',
      description:
        'Access comprehensive patient data with detailed health analytics and tracking history. Streamline consultations with organized medical records and trend analysis.'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
      <h1 className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 font-semibold tracking-wide mb-2">
        Honoring Sacred Time
      </h1>
      <h2 className="text-5xl font-medium text-zinc-800 mb-20">Facing life&apos;s final chapter</h2>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, index) => {
          return (
            <motion.div key={index} variants={containerVariants} className="group relative">
              {/* Gradient glow layer */}
              <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-200 pointer-events-none" />

              <div className="relative bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-lg transition-all duration-200">
                {/* Arrow Icon */}
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm">
                    <div className="w-9 h-9 rounded-full group-hover:bg-gradient-to-tr group-hover:from-red-500 group-hover:via-pink-500 group-hover:to-orange-500 flex items-center justify-center">
                      <ArrowUpRight size={20} className="text-white group-hover:rotate-45 duration-200" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default Audience
