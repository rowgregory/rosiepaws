'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Bell, Activity, Stethoscope } from 'lucide-react'

const InsideTheApp = () => {
  const [activeCard, setActiveCard] = useState(0)

  const features = [
    {
      title: 'Pain Scale Tracking',
      description: 'Visual pain assessment with instant logging and pattern recognition',
      icon: Activity,
      graphic: (
        <div className="relative w-full h-40 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 overflow-hidden">
          {/* Pain scale bars */}
          <div className="flex items-end justify-between h-24 gap-2">
            {[20, 35, 15, 60, 25].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`w-4 rounded-t-lg ${
                  i === 3
                    ? 'bg-gradient-to-t from-red-400 to-orange-500'
                    : i === 1
                      ? 'bg-gradient-to-t from-red-400 to-orange-400'
                      : 'bg-gradient-to-t from-orange-400 to-red-500'
                }`}
              />
            ))}
          </div>
        </div>
      ),
      iconGradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'Smart Reminders',
      description: 'Never miss medication times or vet appointments with intelligent scheduling',
      icon: Bell,
      graphic: (
        <div className="relative w-full h-40 bg-gradient-to-br from-sky-50 to-yellow-50 rounded-2xl p-6 overflow-hidden">
          {/* Calendar grid */}
          <div className="grid grid-cols-7 justify-center gap-1 h-24">
            {Array.from({ length: 21 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`w-3 h-3 rounded ${
                  [5, 8, 12, 15].includes(i)
                    ? 'bg-gradient-to-t from-sky-400 to-sky-600'
                    : [3, 10, 17].includes(i)
                      ? 'bg-gradient-to-t from-yellow-400 to-yellow-600'
                      : 'bg-zinc-200'
                }`}
              />
            ))}
          </div>
          {/* Notification bell */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute bottom-3 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
          >
            <Bell className="w-4 h-4 text-emerald-500" />
          </motion.div>
        </div>
      ),
      iconGradient: 'from-sky-500 to-yellow-500'
    },
    {
      title: 'Water Intake',
      description:
        'Monitor hydration levels over time with detailed charts to help you and your vet make informed decisions.',
      icon: TrendingUp,
      graphic: (
        <div className="relative w-full h-40 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 overflow-hidden">
          {/* Trend line */}
          <svg className="w-full h-24" viewBox="0 0 120 60">
            <motion.path
              d="M10,50 Q30,20 50,30 T90,15 L110,10"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(70.7% 0.165 254.624)" />
                <stop offset="100%" stopColor="oklch(71.5% 0.143 215.221)" />
              </linearGradient>
            </defs>
          </svg>
          {/* Data points */}
          {[
            { x: 20, y: 35 },
            { x: 50, y: 25 },
            { x: 80, y: 15 }
          ].map((point, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.3 }}
              className="absolute w-3 h-3 bg-white rounded-full border-2 border-cyan-400 shadow-sm"
              style={{ left: point.x, top: point.y }}
            />
          ))}
          {/* Trending up icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-3 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
          >
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </motion.div>
        </div>
      ),
      iconGradient: 'from-blue-400 to-cyan-400'
    },
    {
      title: 'Vet Integration',
      description: 'Share comprehensive health reports directly with your veterinarian',
      icon: Stethoscope,
      graphic: (
        <div className="relative w-full h-40 bg-gradient-to-br from-indigo-50 to-rose-100 rounded-2xl p-6 overflow-hidden">
          {/* Medical chart */}
          <div className="flex items-center justify-center h-24">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-12 h-24 bg-white rounded-lg shadow-md border-2 border-indigo-200 relative"
            >
              {/* Chart lines */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="h-0.5 bg-gradient-to-r from-indigo-300 to-rose-400 mx-1 mb-1 rounded"
                />
              ))}
            </motion.div>
          </div>

          {/* Stethoscope icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-3 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
          >
            <Stethoscope className="w-4 h-4 text-indigo-600" />
          </motion.div>
        </div>
      ),
      iconGradient: 'from-indigo-400 to-fuchsia-400'
    }
  ]

  return (
    <div className="max-w-[1320px] mx-auto p-4 mt-40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-orange-400 via-orange-600 to-pink-600 bg-clip-text text-transparent">
            Monitor your pet&apos;s health
          </span>
          <br />
          <span className="bg-gradient-to-r from-red-500 to-fuchsia-600 bg-clip-text text-transparent">
            with intelligent tracking
          </span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Advanced health monitoring tools designed specifically for pets and their families
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onHoverStart={() => setActiveCard(index)}
              className="rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Graphic Section */}
              <div className="mb-6">{feature.graphic}</div>

              {/* Content Section */}
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{
                    scale: activeCard === index ? 1.1 : 1,
                    rotate: activeCard === index ? 360 : 0
                  }}
                  transition={{ duration: 0.6 }}
                  className={`${feature.iconGradient} w-12 h-12 bg-gradient-to-r rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default InsideTheApp
