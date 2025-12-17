'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Brain, FileText, Users } from 'lucide-react'
import { MotionLink } from '../common/MotionLink'

const PeaceOfMindShowcase = () => {
  const [activeWorry, setActiveWorry] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  const worries = [
    {
      worry: 'Am I missing something important?',
      solution: 'Never Wonder Again',
      description: 'Smart tracking ensures you capture every meaningful moment and symptom change.',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [0, 1, 0] }}
                transition={{ delay: i * 0.3, duration: 1.5, repeat: Infinity }}
                className="absolute w-20 h-20 border-2 border-blue-300 rounded-full"
              />
            ))}
          </div>
        </div>
      )
    },
    {
      worry: 'What if I forget their medication?',
      solution: 'Gentle Reminders',
      description: 'Compassionate notifications help you maintain their care routine without stress.',
      icon: Clock,
      color: 'from-green-500 to-emerald-600',
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 border-green-200 rounded-full relative"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
            >
              <Clock className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      )
    },
    {
      worry: 'How do I explain this to the vet?',
      solution: 'Clear Communication',
      description: "Generate detailed reports that help your vet understand your pet's complete picture.",
      icon: FileText,
      color: 'from-purple-500 to-violet-600',
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            {[100, 80, 60].map((width, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="h-3 bg-gradient-to-r from-purple-300 to-violet-400 rounded-full"
              />
            ))}
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center"
          >
            <FileText className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      )
    },
    {
      worry: "My family doesn't know how to help",
      solution: 'Everyone Connected',
      description: 'Share care responsibilities so your whole family can contribute to their comfort.',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl flex items-center justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  delay: i * 0.3,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
                className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center"
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  ]

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setActiveWorry((prev) => (prev + 1) % worries.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isAnimating, worries.length])

  return (
    <div className="max-w-7xl mx-auto p-4 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-800 rounded-full text-sm font-semibold mb-6">
            Peace of Mind When You Need It Most
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Overwhelming{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500">
              Into Organized
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            You&apos;re already carrying so much. Let us help you organize the care so you can focus on what matters
            most—loving them.
          </p>
        </motion.div>
      </div>

      {/* Interactive Worry Cards */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Worry Navigation */}
        <div className="space-y-4">
          {worries.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeWorry === index
                  ? 'bg-white shadow-xl border-2 border-gray-200'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => {
                setActiveWorry(index)
                setIsAnimating(false)
              }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0 ${
                    activeWorry === index ? 'shadow-lg' : ''
                  }`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-2 transition-colors ${
                      activeWorry === index ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    &quot;{item.worry}&quot;
                  </h3>
                  <AnimatePresence mode="wait">
                    {activeWorry === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}
                        >
                          {item.solution}
                        </div>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side - Visual */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorry}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {worries[activeWorry].visual}
            </motion.div>
          </AnimatePresence>

          {/* Decorative elements */}
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-400/20 via-pink-400/20 to-orange-400/20 rounded-3xl blur-xl -z-10" />
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center mt-16"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">You don&apos;t have to navigate this alone</h3>
          <p className="text-gray-600 mb-8">
            Join thousands of pet families who&apos;ve found comfort in organized, compassionate care tracking.
          </p>
          <MotionLink
            href="/auth/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Get Started
          </MotionLink>
        </div>
      </motion.div>
    </div>
  )
}

export default PeaceOfMindShowcase
