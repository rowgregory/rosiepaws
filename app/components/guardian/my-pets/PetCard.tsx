import { setOpenPetUpdateDrawer, setSelectedPetWithChartData } from '@/app/redux/features/petSlice'
import { useAppDispatch } from '@/app/redux/store'
import { Pet } from '@/app/types/entities'
import { ArrowRight, Calendar, Edit, MoreVertical, Shield, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { FC, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { setInputs } from '@/app/redux/features/formSlice'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { useDeletePetMutation } from '@/app/redux/services/petApi'
import { processChartDataForPet } from '@/app/lib/utils/public/dashboard/processChartData'
import { calculatePetStats } from '@/app/lib/utils/public/dashboard/calculatePetStats'

const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase()
}

const PetCard: FC<{ pet: Pet; index: number }> = ({ pet, index }) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [deletePet, { isLoading }] = useDeletePetMutation()
  const menuRef = useRef(null) as any

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEdit = () => {
    dispatch(setOpenPetUpdateDrawer())
    dispatch(setInputs({ formName: 'petForm', data: { ...pet, type: pet.type.toLowerCase() } }))
    setIsOpen(false)
  }

  const handleDelete = () => {
    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Pet',
          description: `Deleting this pet will permanently remove all related data, including all logs you've connected to this pet.`,
          confirmText: 'Delete Pet',
          onConfirm: async () => {
            try {
              await deletePet({ petId: pet.id }).unwrap()
              dispatch(setCloseAdminConfirmModal())
            } catch (err: any) {
              console.log('Error deleting pet: ', err)
            }
          },
          isDestructive: true,
          isProcessing: isLoading
        }
      })
    )
  }

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
          <div className="relative" ref={menuRef}>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-gray-400 hover:text-gray-600"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-8 z-40 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1"
                >
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
          {pet.lastVisit ? (
            <span className="text-gray-900 font-medium">{pet.lastVisit?.toLocaleDateString()}</span>
          ) : (
            <Link href="/guardian/pets/appointments" className="hover:text-pink-500 duration-300">
              Log Appointment
            </Link>
          )}
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
            {pet.nextVisit && (
              <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                <Calendar className="w-3 h-3 mr-1" />
                <span>Next: {pet.nextVisit?.toLocaleDateString()}</span>
              </motion.div>
            )}
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
        <Link
          href="/guardian/dashboard"
          onClick={() => {
            const chartData = processChartDataForPet(pet)
            const stats = calculatePetStats(pet, chartData)
            dispatch(
              setSelectedPetWithChartData({
                pet,
                chartData,
                stats
              })
            )
          }}
          className="block w-full"
        >
          <motion.div
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white focus:outline-none"
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
