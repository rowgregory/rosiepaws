import { Medication } from '@/app/types/model.types'
import { getTimeUntilNext } from '@/app/utils/medication-helpers'
import { AlertCircle, Calendar, Clock, Pill } from 'lucide-react'
import React, { FC } from 'react'
import { motion } from 'framer-motion'

interface IMedicationOverStats {
  activeMedications: Medication[]
  currentTime: Date
}

const MedicationOverviewStats: FC<IMedicationOverStats> = ({ activeMedications, currentTime }) => {
  const stats = [
    {
      label: 'Active',
      value: activeMedications.length,
      color: 'text-gray-900',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: Pill,
      delay: 0
    },
    {
      label: 'Due Soon',
      value: activeMedications.filter((med) => {
        const timeRemaining = getTimeUntilNext(med.reminderTimes, currentTime)
        return timeRemaining && timeRemaining.hours === 0 && timeRemaining.minutes <= 30 && !timeRemaining.isOverdue
      }).length,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: Clock,
      delay: 0.1
    },
    {
      label: 'Overdue',
      value: activeMedications.filter((med) => {
        const timeRemaining = getTimeUntilNext(med.reminderTimes, currentTime)
        return timeRemaining?.isOverdue
      }).length,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: AlertCircle,
      delay: 0.2
    },
    {
      label: "Today's Doses",
      value: activeMedications.reduce((total, med) => total + (med.reminderTimes?.length || 0), 0),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: Calendar,
      delay: 0.3
    }
  ]

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants: any = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }

  const iconVariants: any = {
    hidden: {
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: 0.3
      }
    }
  }

  const numberVariants: any = {
    hidden: {
      opacity: 0,
      scale: 0.5
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: 0.4
      }
    }
  }

  const hoverVariants: any = {
    scale: 1.02,
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon

        return (
          <motion.div
            key={stat.label}
            className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer"
            variants={cardVariants}
            whileHover={hoverVariants}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <motion.p
                  className="text-sm font-medium text-gray-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.label}
                </motion.p>
                <motion.p className={`text-2xl font-bold ${stat.color}`} variants={numberVariants}>
                  {stat.value}
                </motion.p>
              </div>
              <motion.div
                className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                variants={iconVariants}
                whileHover={{
                  rotate: 5,
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              >
                <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
              </motion.div>
            </div>

            {/* Subtle background animation */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'linear'
              }}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default MedicationOverviewStats
