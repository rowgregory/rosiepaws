import React, { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch } from '@/app/redux/store'
import { setInputs } from '@/app/redux/features/formSlice'
import { IMedication } from '@/app/types'
import { formatTimeRemaining, getNextDoseTime } from '@/app/lib/utils'
import { itemVariants } from '@/app/lib/constants'
import { setOpenMedicationUpdateDrawer } from '@/app/redux/features/medicationSlice'

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

interface IActiveMedicationCard {
  medication: IMedication
  status: any
  timeRemaining: any
  currentTime: Date
  StatusIcon: any
  index?: number
}

const ActiveMedicationCard: FC<IActiveMedicationCard> = ({
  medication,
  status,
  timeRemaining,
  currentTime,
  StatusIcon,
  index = 0
}) => {
  const dispatch = useAppDispatch()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={medication.id}
        onClick={() => {
          dispatch(setInputs({ formName: 'medicationForm', data: medication }))
          dispatch(setOpenMedicationUpdateDrawer())
        }}
        className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer overflow-hidden relative"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileTap={{ scale: 0.98 }}
        whileHover={{
          scale: 1.01,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderColor: '#E0E7FF'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
      >
        {/* Subtle background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'linear'
          }}
        />

        <motion.div
          className="flex items-start justify-between relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1">
            <motion.div className="flex items-center gap-3 mb-2" variants={itemVariants}>
              <motion.h3
                className="text-lg font-semibold text-gray-900"
                whileHover={{ scale: 1.02, color: '#4F46E5' }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {medication.drugName}
              </motion.h3>
              <motion.span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: status.status === 'overdue' ? [0, 5, -5, 0] : 0 }}
                  transition={{
                    duration: 0.5,
                    repeat: status.status === 'overdue' ? Infinity : 0,
                    repeatDelay: 2
                  }}
                >
                  <StatusIcon className="h-3 w-3" />
                </motion.div>
                {status.status}
              </motion.span>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <p className="font-medium">Pet</p>
                <motion.p
                  whileHover={{ scale: 1.02, color: '#4F46E5' }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {medication.pet?.name}
                </motion.p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="font-medium">Dosage</p>
                <motion.p
                  whileHover={{ scale: 1.02, color: '#4F46E5' }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {medication.dosage} {medication.dosageUnit}
                </motion.p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="font-medium">Frequency</p>
                <motion.p
                  whileHover={{ scale: 1.02, color: '#4F46E5' }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {medication.frequency}
                </motion.p>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {medication.instructions && (
                <motion.div
                  className="mt-3 p-3 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    marginTop: 12
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginTop: 0
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6 + index * 0.1
                  }}
                  whileHover={{
                    backgroundColor: '#EBF4FF',
                    scale: 1.01
                  }}
                >
                  <p className="text-sm text-blue-800">
                    <strong>Instructions:</strong> {medication.instructions}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div className="ml-6 text-right" variants={itemVariants}>
            <div className="space-y-2">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
                <p className="text-sm font-medium text-gray-900">Next Dose</p>
                <motion.p
                  className="text-lg font-bold text-indigo-600"
                  animate={
                    timeRemaining?.isOverdue
                      ? {
                          color: ['#DC2626', '#EF4444', '#DC2626']
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: timeRemaining?.isOverdue ? Infinity : 0
                  }}
                >
                  {formatTimeRemaining(timeRemaining)}
                </motion.p>
                <p className="text-xs text-gray-500">{getNextDoseTime(medication.reminderTimes, currentTime)}</p>
              </motion.div>

              <motion.div className="flex flex-wrap gap-1" variants={containerVariants}>
                {medication.reminderTimes?.map((time: string, i: number) => (
                  <motion.span
                    key={time}
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    variants={{
                      hidden: {
                        opacity: 0,
                        scale: 0.8
                      },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                          delay: i * 0.1
                        }
                      }
                    }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: '#F3F4F6',
                      color: '#4F46E5'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {time}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ActiveMedicationCard
