import React from 'react'
import { motion } from 'framer-motion'

const AnimatedDrawerHeader = ({ title, subtitle, Icon, closeDrawer, color, iconGradient }: any) => {
  return (
    <motion.div
      className="px-5 pt-6 pb-4 border-b border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`${iconGradient} p-2 bg-gradient-to-br rounded-xl`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 400,
              damping: 25
            }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </motion.div>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            delay: 0.5,
            type: 'spring',
            stiffness: 400,
            damping: 25,
            rotate: {
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }
          }}
        >
          <Icon onClick={closeDrawer} className={`${color} w-6 h-6 cursor-pointer`} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AnimatedDrawerHeader
