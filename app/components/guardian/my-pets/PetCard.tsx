import { setPet } from '@/app/redux/features/petSlice'
import { useAppDispatch } from '@/app/redux/store'
import { Pet } from '@/app/types/entities'
import { ArrowRight, Calendar, MoreVertical, Shield } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'
import { motion } from 'framer-motion'

const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase()
}

const PetCard: FC<{ pet: Pet; index: number }> = ({ pet, index }) => {
  const dispatch = useAppDispatch()

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        borderColor: '#d1d5db',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card Header */}
      <motion.div
        className="p-6 pb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-pink-100 to-orange-100 rounded-lg flex items-center justify-center"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.1 + 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
            >
              <span className="text-pink-700 font-semibold text-sm">{getInitials(pet.name)}</span>
            </motion.div>
            <motion.div
              className="ml-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-900">{pet.name}</h3>
              <p className="text-sm text-gray-600">
                {pet.breed} • {pet.age}
              </p>
            </motion.div>
          </div>
          <motion.button
            className="p-1 text-gray-400 hover:text-gray-600"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Pet Details */}
      <motion.div
        className="px-6 pb-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.6, duration: 0.4 }}
      >
        <motion.div
          className="flex justify-between text-sm"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.7, duration: 0.3 }}
        >
          <span className="text-gray-600">Weight</span>
          <span className="text-gray-900 font-medium">{pet.weight}</span>
        </motion.div>
        <motion.div
          className="flex justify-between text-sm"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.8, duration: 0.3 }}
        >
          <span className="text-gray-600">Last Visit</span>
          <span className="text-gray-900 font-medium">{pet.lastVisit?.toLocaleDateString()}</span>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="px-6 pb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 1.0, duration: 0.3 }}
      >
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <Calendar className="w-3 h-3 mr-1" />
              <span>Next: {pet.nextVisit?.toLocaleDateString()}</span>
            </motion.div>
            {pet.microchipId && (
              <motion.div
                className="flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 1.1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
              >
                <Shield className="w-3 h-3 mr-1 text-green-500" />
                <span>Microchipped</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        className="px-6 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 1.2, duration: 0.4 }}
      >
        <Link href="/guardian/dashboard" onClick={() => dispatch(setPet(pet))} className="block w-full">
          <motion.div
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            whileHover={{
              backgroundColor: '#f9fafb',
              borderColor: '#9ca3af',
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Health Dashboard</span>
            <motion.div initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default PetCard
