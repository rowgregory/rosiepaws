import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const FeaturesDropdown = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.div
      className="bg-gray-900 rounded-2xl p-6 w-[600px] shadow-2xl border border-gray-700 grid grid-cols-3 gap-x-6 absolute top-full left-0 z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Feature with Image */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="relative mb-4">
          <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Heart size={32} className="text-white" />
              </div>
            </div>
          </div>
          <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            NEW
          </div>
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">Pet Health Dashboard</h3>
        <p className="text-gray-400 text-sm">
          Comprehensive health monitoring with real-time insights for your pet&apos;s wellbeing.
        </p>
      </motion.div>

      {/* Feature Grid */}
      <div className="gap-6">
        <motion.div variants={itemVariants}>
          <h4 className="text-white font-medium mb-1">Pain Scoring</h4>
          <p className="text-gray-400 text-13 mb-3">
            Track comfort levels with our comprehensive pain assessment tools.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-white font-medium mb-1">Water Intake</h4>
          <p className="text-gray-400 text-13 mb-3">Monitor hydration with smart consumption tracking and alerts.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-white font-medium mb-1">Feeding Records</h4>
          <p className="text-gray-400 text-13 mb-3">
            Keep detailed feeding schedules and nutritional analysis records.
          </p>
        </motion.div>
      </div>
      <div className="gap-6">
        <motion.div variants={itemVariants}>
          <h4 className="text-white font-medium mb-1">Seizure Tracking</h4>
          <p className="text-gray-400 text-13 mb-3">Document episodes with precise timing and severity tracking.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-white font-medium mb-1">Vital Signs</h4>
          <p className="text-gray-400 text-13 mb-3">
            Monitor heart rate, temperature, and other essential health metrics.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-white font-medium mb-1">Med Reminders</h4>
          <p className="text-gray-400 text-13 mb-3">Never miss medication with smart scheduling and dose tracking.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default FeaturesDropdown
