'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const HomeHero = () => {
  const src = '/videos/xyla-hero.mp4'

  return (
    <div className="relative w-full h-full -mt-20 sm:mt-[-112px]">
      <video
        className="object-cover w-full h-dvh sm:min-h-[1200px]"
        controls={false}
        autoPlay={true}
        loop
        muted={true}
        playsInline
        preload="auto"
        suppressHydrationWarning // Suppress hydration warning for video
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-30"></div>

      <div className="absolute inset-0 max-w-[1320px] mx-auto z-40 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div className="max-w-4xl w-full px-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                type: 'spring',
                stiffness: 100,
                damping: 15
              }}
              className="backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl px-6 py-8 md:px-8 md:py-6 shadow-2xl flex items-center justify-center flex-col"
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 md:mb-3 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 80
                }}
              >
                Every Moment&nbsp;
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Deserves <br />
                  to Be Remembered
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed text-center max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 60
                }}
              >
                Track symptoms and provide comfort <br className="hidden sm:block" />
                during your pet&apos;s final journey
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.0,
              duration: 0.6
            }}
            className="mt-8 md:mt-16"
          >
            <Link
              href="/auth/login"
              className="relative px-6 py-3 md:px-5 md:py-2.5 rounded-full text-base md:text-lg text-white backdrop-blur-lg border border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/30 inline-block"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HomeHero
