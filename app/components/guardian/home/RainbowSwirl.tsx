'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

const RainbowSwirl = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Main morphing gradient blob */}
      <motion.div
        className="absolute inset-0 opacity-90"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 80% at 20% 30%, #ff0080 0%, #ff8000 25%, #ffff00 50%, #00ff00 75%, #0080ff 100%)',
            'radial-gradient(ellipse 80% 40% at 70% 60%, #ff8000 0%, #ffff00 25%, #00ff00 50%, #0080ff 75%, #8000ff 100%)',
            'radial-gradient(ellipse 40% 90% at 30% 80%, #ffff00 0%, #00ff00 25%, #0080ff 50%, #8000ff 75%, #ff0080 100%)',
            'radial-gradient(ellipse 90% 50% at 80% 20%, #00ff00 0%, #0080ff 25%, #8000ff 50%, #ff0080 75%, #ff8000 100%)',
            'radial-gradient(ellipse 50% 70% at 40% 40%, #0080ff 0%, #8000ff 25%, #ff0080 50%, #ff8000 75%, #ffff00 100%)',
            'radial-gradient(ellipse 60% 80% at 20% 30%, #ff0080 0%, #ff8000 25%, #ffff00 50%, #00ff00 75%, #0080ff 100%)'
          ]
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Fluid blob shape 1 - organic movement */}
      <motion.div
        className="absolute w-80 h-80 blur-3xl opacity-70"
        style={{
          background: 'linear-gradient(45deg, #ff0080, #ff8000, #ffff00)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
        }}
        animate={{
          x: [50, 250, 450, 350, 150, 50],
          y: [100, 50, 200, 400, 300, 100],
          scale: [1, 1.3, 0.8, 1.5, 1.1, 1],
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '70% 30% 60% 40% / 40% 70% 60% 30%',
            '40% 70% 30% 60% / 70% 40% 50% 60%',
            '50% 60% 40% 70% / 30% 50% 70% 40%',
            '60% 40% 30% 70% / 60% 30% 70% 40%'
          ]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Fluid blob shape 2 - wave-like movement */}
      <motion.div
        className="absolute w-72 h-72 blur-3xl opacity-60"
        style={{
          background: 'linear-gradient(135deg, #00ff00, #0080ff, #8000ff)',
          borderRadius: '40% 60% 60% 40% / 70% 30% 70% 30%'
        }}
        animate={{
          x: [400, 300, 100, 200, 500, 400],
          y: [200, 400, 350, 100, 150, 200],
          scale: [0.9, 1.4, 1, 0.7, 1.2, 0.9],
          borderRadius: [
            '40% 60% 60% 40% / 70% 30% 70% 30%',
            '60% 40% 30% 70% / 40% 70% 30% 60%',
            '30% 70% 40% 60% / 60% 40% 70% 30%',
            '70% 30% 60% 40% / 30% 60% 40% 70%',
            '50% 50% 50% 50% / 60% 40% 60% 40%',
            '40% 60% 60% 40% / 70% 30% 70% 30%'
          ]
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Fluid blob shape 3 - spiral movement */}
      <motion.div
        className="absolute w-64 h-64 blur-3xl opacity-50"
        style={{
          background: 'linear-gradient(225deg, #ffff00, #00ff00, #0080ff)',
          borderRadius: '70% 30% 30% 70% / 60% 60% 40% 40%'
        }}
        animate={{
          x: [300, 400, 350, 250, 200, 300],
          y: [300, 200, 100, 150, 250, 300],
          scale: [1.2, 0.8, 1.5, 1, 0.9, 1.2],
          borderRadius: [
            '70% 30% 30% 70% / 60% 60% 40% 40%',
            '30% 70% 70% 30% / 40% 40% 60% 60%',
            '60% 40% 40% 60% / 70% 30% 30% 70%',
            '40% 60% 60% 40% / 30% 70% 70% 30%',
            '50% 50% 50% 50% / 50% 50% 50% 50%',
            '70% 30% 30% 70% / 60% 60% 40% 40%'
          ]
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Flowing element 4 - figure-8 pattern */}
      <motion.div
        className="absolute w-56 h-56 blur-3xl opacity-40"
        style={{
          background: 'radial-gradient(ellipse, #8000ff, #ff0080, #ff8000)',
          borderRadius: '80% 20% 20% 80% / 50% 70% 30% 50%'
        }}
        animate={{
          x: [150, 350, 450, 350, 150, 50, 150],
          y: [400, 350, 250, 150, 100, 200, 400],
          scale: [0.7, 1.1, 1.3, 0.8, 1.2, 0.9, 0.7],
          borderRadius: [
            '80% 20% 20% 80% / 50% 70% 30% 50%',
            '20% 80% 80% 20% / 70% 30% 50% 70%',
            '60% 40% 40% 60% / 40% 60% 60% 40%',
            '40% 60% 60% 40% / 80% 20% 20% 80%',
            '70% 30% 30% 70% / 30% 50% 70% 50%',
            '30% 70% 70% 30% / 60% 40% 40% 60%',
            '80% 20% 20% 80% / 50% 70% 30% 50%'
          ]
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Flowing element 5 - organic swirl */}
      <motion.div
        className="absolute w-48 h-48 blur-3xl opacity-35"
        style={{
          background: 'conic-gradient(from 0deg, #ff0080, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0080)',
          borderRadius: '90% 10% 10% 90% / 80% 20% 80% 20%'
        }}
        animate={{
          x: [500, 450, 300, 150, 100, 250, 500],
          y: [100, 200, 300, 400, 350, 200, 100],
          scale: [1, 0.6, 1.4, 0.8, 1.1, 1.3, 1],
          rotate: [0, 120, 240, 360, 480, 600, 720],
          borderRadius: [
            '90% 10% 10% 90% / 80% 20% 80% 20%',
            '10% 90% 90% 10% / 20% 80% 20% 80%',
            '50% 50% 50% 50% / 90% 10% 10% 90%',
            '70% 30% 30% 70% / 10% 90% 90% 10%',
            '30% 70% 70% 30% / 60% 40% 40% 60%',
            '60% 40% 40% 60% / 40% 60% 60% 40%',
            '90% 10% 10% 90% / 80% 20% 80% 20%'
          ]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Flowing element 6 - undulating wave */}
      <motion.div
        className="absolute w-40 h-40 blur-2xl opacity-30"
        style={{
          background: 'linear-gradient(45deg, #00ff00, #0080ff, #8000ff, #ff0080)',
          borderRadius: '75% 25% 25% 75% / 25% 75% 75% 25%'
        }}
        animate={{
          x: [200, 400, 500, 300, 100, 200],
          y: [50, 150, 350, 450, 250, 50],
          scale: [0.8, 1.2, 0.9, 1.4, 1, 0.8],
          borderRadius: [
            '75% 25% 25% 75% / 25% 75% 75% 25%',
            '25% 75% 75% 25% / 75% 25% 25% 75%',
            '60% 40% 40% 60% / 60% 40% 40% 60%',
            '40% 60% 60% 40% / 40% 60% 60% 40%',
            '85% 15% 15% 85% / 15% 85% 85% 15%',
            '75% 25% 25% 75% / 25% 75% 75% 25%'
          ]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Overlay gradient for depth */}
      <motion.div
        className="absolute inset-0 opacity-25"
        animate={{
          background: [
            'linear-gradient(45deg, transparent 0%, rgba(255,0,128,0.3) 30%, transparent 70%, rgba(0,255,0,0.2) 100%)',
            'linear-gradient(135deg, transparent 0%, rgba(0,128,255,0.3) 30%, transparent 70%, rgba(255,255,0,0.2) 100%)',
            'linear-gradient(225deg, transparent 0%, rgba(128,0,255,0.3) 30%, transparent 70%, rgba(255,128,0,0.2) 100%)',
            'linear-gradient(315deg, transparent 0%, rgba(255,255,0,0.3) 30%, transparent 70%, rgba(255,0,128,0.2) 100%)',
            'linear-gradient(45deg, transparent 0%, rgba(255,0,128,0.3) 30%, transparent 70%, rgba(0,255,0,0.2) 100%)'
          ]
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Center content area */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default RainbowSwirl
