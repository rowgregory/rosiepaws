import React from 'react'
import { motion } from 'framer-motion'

const AnimatedDrawerHeader = ({ title, subtitle, Icon, closeDrawer, color, iconGradient }: any) => {
  return (
    <motion.div
      className="px-5 py-3 border-b border-gray-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div
            className={`${iconGradient} p-1.5 bg-gradient-to-br rounded-lg`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
            whileHover={{ scale: 1.05 }}
          >
            <Icon className="w-4 h-4 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
          whileHover={{ scale: 1.1, opacity: 0.7 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon onClick={closeDrawer} className={`${color} w-5 h-5 cursor-pointer`} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AnimatedDrawerHeader
