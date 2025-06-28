'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

const HomeHero = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const src = '/videos/xyla-hero.mp4'

  return (
    <div className="relative w-full h-full">
      <video
        className="object-cover w-full h-full aspect-video max-h-[900px]"
        controls={false}
        autoPlay
        loop
        muted={true}
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* White Bottom Fade - Solid white at bottom, fading up */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-30"></div>

      {/* Content Overlay Container with max-width */}
      <div className="absolute inset-0 max-w-[1320px] mx-auto z-40">
        {/* Title and Subtitle Overlay - Left Side Centered */}
        <div className="absolute inset-y-0 left-6 flex items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              delay: 0.3,
              type: 'spring',
              stiffness: 80
            }}
            className="max-w-md"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-3xl px-8 py-6 shadow-2xl"
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Every Moment
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  animate={{
                    backgroundPosition: isTitleHovered ? '200% center' : '0% center'
                  }}
                  transition={{ duration: 1.5 }}
                >
                  Deserves to Be Remembered
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-white/90 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Monitor health, track symptoms, and maintain detailed records for your pet&apos;s
                <motion.span
                  className="text-amber-300 font-semibold"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {' '}
                  compassionate care
                </motion.span>
              </motion.p>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-3 -left-3"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Heart className="w-6 h-6 text-pink-400 fill-current" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Xyla Info Overlay - Smaller */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: 'spring',
            stiffness: 100
          }}
          className="absolute bottom-4 right-6 z-30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-lg border border-white/20 rounded-xl px-3 py-2 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.2 : 1
                }}
                transition={{ duration: 0.6 }}
                className="bg-white/20 rounded-full p-1"
              >
                <Heart className="w-3 h-3 text-white fill-current" />
              </motion.div>

              <div className="text-white">
                <motion.h3
                  className="font-bold text-sm leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Xyla
                </motion.h3>
                <motion.p
                  className="text-white/90 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  4 months old
                </motion.p>
                <motion.p
                  className="text-white/80 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Living with Hydrocephalus
                </motion.p>
              </div>
            </div>

            {/* Floating sparkles animation */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomeHero
