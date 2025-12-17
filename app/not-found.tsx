'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Mail } from 'lucide-react'

const RosiePaws404 = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
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

  const buttonHover: any = {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  }

  return (
    <div className="min-h-[calc(100dvh-543px)] bg-white flex items-center justify-center p-4">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        {/* 404 Number */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-8xl md:text-9xl font-light text-gray-800 tracking-tight">404</h1>
        </motion.div>

        {/* Main heading */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find what you need.
          </p>
        </motion.div>

        {/* Primary actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          variants={itemVariants}
        >
          <motion.button
            className="flex items-center gap-3 bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors min-w-[160px] justify-center"
            whileHover={buttonHover}
            whileTap={{ scale: 0.98 }}
          >
            <Home size={18} />
            Return Home
          </motion.button>
        </motion.div>

        {/* Contact information */}
        <motion.div className="bg-gray-50 p-6 rounded-lg mb-8" variants={itemVariants}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Immediate Assistance?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="mailto:help@rosiepaws.com"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Mail size={18} />
              <span className="font-medium">support@rosiepaws.com</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Back navigation */}
        <motion.div variants={itemVariants}>
          <motion.button
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-medium"
            whileHover={{ x: -3 }}
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>
        </motion.div>

        {/* Subtle branding */}
        <motion.div className="mt-12 pt-6 border-t border-gray-200" variants={itemVariants}>
          <p className="text-sm text-gray-500">© 2025 Rosie Paws.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RosiePaws404
