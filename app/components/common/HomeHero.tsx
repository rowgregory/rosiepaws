'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const HomeHero = () => {
  const [isClient, setIsClient] = useState(false)
  const src = '/videos/xyla-hero.mp4'

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="relative w-full h-full mt-[-112px]">
      <video
        className="object-cover w-full h-[900px]"
        controls={false}
        autoPlay={isClient} // Only autoplay on client
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

      <div className="absolute inset-0 max-w-[1320px] mx-auto z-40">
        <div className="absolute inset-0 flex mt-40 flex-col items-center z-10">
          {/* Only animate after client hydration */}
          {isClient ? (
            <motion.div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                className="backdrop-blur-lg border border-white/10 rounded-3xl px-8 py-6 shadow-2xl flex items-center justify-center flex-col"
              >
                {/* Your motion components here */}
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-3 text-center"
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
                    className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    Deserves <br />
                    to Be Remembered
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-white/90 leading-relaxed text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 60
                  }}
                >
                  Track symptoms and provide comfort <br />
                  during your pet&apos;s final journey
                </motion.p>
              </motion.div>
            </motion.div>
          ) : (
            // Static version for SSR
            <div className="max-w-4xl">
              <div className="backdrop-blur-lg border border-white/10 rounded-3xl px-8 py-6 shadow-2xl flex items-center justify-center flex-col">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-3 text-center">
                  Every Moment&nbsp;
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Deserves <br />
                    to Be Remembered
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed text-center">
                  Track symptoms and provide comfort <br />
                  during your pet&apos;s final journey
                </p>
              </div>
            </div>
          )}

          <Link
            href="/auth/login"
            className="relative px-5 py-2.5 rounded-full text-lg text-white backdrop-blur-lg border border-white/10 mt-16 overflow-hidden group transition-all duration-300 hover:border-white/30"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeHero
