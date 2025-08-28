'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MotionLink } from '../common/MotionLink'

const Solution = () => {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const statVariants: any = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: 'backOut' }
    }
  }

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-50/80 via-green-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="relative z-10 grid lg:grid-cols-2 gap-12 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Left side - Main content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-6">
                Rosie Paws empowers pet owners to be{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                  health advocates
                </span>{' '}
                for their beloved companions with comprehensive tracking tools
              </h2>
            </motion.div>

            <MotionLink href="/auth/login" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <div className="bg-gradient-to-r from-pink-500 to-orange-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="text-lg">Start Tracking Today</span>
                </div>
              </motion.div>
            </MotionLink>

            {/* Stats */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8" variants={containerVariants}>
              <motion.div
                variants={statVariants}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
              >
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">~73%</div>
                <div className="text-base text-gray-700 font-medium">
                  of pet health issues go unnoticed until serious
                </div>
              </motion.div>

              <motion.div
                variants={statVariants}
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100"
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-base text-gray-700 font-medium">continuous health monitoring and alerts</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right side - Process steps */}
          <motion.div className="space-y-8" variants={containerVariants}>
            {/* Problem */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-sm">
                  01
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">The Problem</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pet owners struggle to track symptoms, remember medication schedules, and communicate effectively
                    with veterinarians, leading to missed health patterns and delayed treatment.
                  </p>
                </div>
              </div>
              {/* Connecting line */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: 40 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="w-0.5 bg-gradient-to-b from-red-400 to-emerald-400 ml-6 mt-6"
              />
            </motion.div>

            {/* Solution */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-sm">
                  02
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Our Solution</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Rosie Paws provides intuitive health tracking, smart medication reminders, and comprehensive vet
                    reports to ensure nothing falls through the cracks.
                  </p>
                </div>
              </div>
              {/* Connecting line */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: 40 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="w-0.5 bg-gradient-to-b from-emerald-400 to-blue-400 ml-6 mt-6"
              />
            </motion.div>

            {/* Result */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-sm">
                  03
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">The Result</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our platform gives you the confidence and tools to be your pet&apos;s best health advocate, ensuring
                    they live their happiest, healthiest life.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Solution
