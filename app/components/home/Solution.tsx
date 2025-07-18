'use client'

import React from 'react'
import { motion } from 'framer-motion'

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
    <div className="mt-40 max-w-6xl mx-auto rounded-3xl p-8 md:p-12 shadow-lg min-h-[600px] relative overflow-hidden border border-gray-100">
      {/* Top-right glow effect */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-400/15 via-green-300/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-gradient-to-bl from-emerald-500/25 via-green-400/15 to-blue-400/5 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        className="relative z-10 grid lg:grid-cols-2 gap-12 items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left side - Main content */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Rosie Paws empowers pet owners to be{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                health advocates
              </span>{' '}
              for their beloved companions with comprehensive tracking tools.
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/30 overflow-hidden group"
            >
              {/* Heartbeat pulse effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20"
                animate={{
                  opacity: [0.3, 0.8, 0.3, 0.8, 0.3],
                  scale: [1, 1.02, 1, 1.02, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.2, 0.3, 0.5, 1]
                }}
              />

              {/* Health data stream */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-0.5 bg-white/30 rounded-full"
                    style={{
                      width: `${20 + i * 15}px`,
                      top: `${25 + i * 12}%`,
                      left: '-20px'
                    }}
                    animate={{
                      x: ['0%', '250%'],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </div>

              {/* Subtle shine sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />

              <span className="relative z-10 flex items-center gap-3">
                <span className="text-lg">Start Tracking Today</span>

                {/* Animated paw print trail */}
                <div className="relative">
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>

                  {/* Paw prints that follow */}
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute -left-3 top-1/2 -translate-y-1/2"
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{
                        opacity: [0, 0.6, 0],
                        scale: [0, 0.8, 0],
                        x: [-8 * (i + 1), -16 * (i + 1)]
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: 'easeOut'
                      }}
                    >
                      <svg className="w-3 h-3 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 16c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-7-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </motion.div>
                  ))}
                </div>
              </span>

              {/* Health monitor border pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-emerald-300/50"
                animate={{
                  borderColor: ['rgba(110, 231, 183, 0.3)', 'rgba(110, 231, 183, 0.8)', 'rgba(110, 231, 183, 0.3)']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8" variants={containerVariants}>
            <motion.div
              variants={statVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.1)'
              }}
              className="rounded-2xl p-6 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-[100px] h-[100px] bg-gradient-to-bl from-red-400/15 via-pink-300/8 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-bl from-red-500/25 via-pink-400/15 to-blue-orange/5 rounded-full blur-2xl pointer-events-none" />

              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
                ~73%
              </div>
              <div className="text-lg text-gray-700 font-medium">of pet health issues go unnoticed until serious</div>
            </motion.div>

            <motion.div
              variants={statVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)'
              }}
              className="rounded-2xl p-6 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-[100px] h-[100px] bg-gradient-to-bl from-green-400/15 via-emerald-300/8 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-bl from-green-500/25 emerald-pink-400/15 to-blue-orange/5 rounded-full blur-2xl pointer-events-none" />
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-lg text-gray-700 font-medium">continuous health monitoring and alerts</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Problem/Solution steps */}
        <motion.div className="space-y-8" variants={containerVariants}>
          {/* Problem */}
          <motion.div variants={itemVariants} className="relative">
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{
                  rotate: 360,
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.2)'
                }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg"
              >
                01
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Problem</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Pet owners struggle to track symptoms, remember medication schedules, and communicate effectively with
                  veterinarians, leading to missed health patterns and delayed treatment.
                </p>
              </div>
            </div>
            {/* Connecting line */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 60 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-0.5 bg-gradient-to-b from-red-400 via-orange-400 to-emerald-400 ml-6 mt-6 shadow-sm"
            />
          </motion.div>

          {/* Solution */}
          <motion.div variants={itemVariants} className="relative">
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{
                  rotate: 360,
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)'
                }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg"
              >
                02
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Solution</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Rosie Paws provides intuitive health tracking, smart medication reminders, and comprehensive vet
                  reports to ensure nothing falls through the cracks.
                </p>
              </div>
            </div>
            {/* Connecting line */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 60 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="w-0.5 bg-gradient-to-b from-emerald-400 via-green-400 to-blue-400 ml-6 mt-6 shadow-sm"
            />
          </motion.div>

          {/* For Pet Families */}
          <motion.div variants={itemVariants} className="relative">
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{
                  rotate: 360,
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)'
                }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg"
              >
                03
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">For Pet Families</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our platform gives you the confidence and tools to be your pet&apos;s best health advocate, ensuring
                  they live their happiest, healthiest life.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Solution
