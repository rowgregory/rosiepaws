import { setOpenPetDrawer, setSelectedPetWithChartData } from '@/app/redux/features/petSlice'
import { useAppDispatch } from '@/app/redux/store'
import { Pet } from '@/app/types/entities'
import { Activity, ArrowRight, Calendar, Edit, Heart, MoreVertical, Shield, Trash2 } from 'lucide-react'
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
  const [deletePet] = useDeletePetMutation()
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
    dispatch(setOpenPetDrawer())
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
            await deletePet({ petId: pet.id }).unwrap()
            dispatch(setCloseAdminConfirmModal())
          },
          isDestructive: true
        }
      })
    )
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {/* Card Header */}
      <motion.div
        className="p-6 pb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.1 + 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              {getInitials(pet.name)}
            </motion.div>

            <motion.div
              className="ml-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-1">{pet.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600 font-medium">{pet.breed}</span>
                <span className="text-sm text-gray-500">{pet.age}</span>
              </div>
            </motion.div>
          </div>

          <div className="relative" ref={menuRef}>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
              whileHover={{ scale: 1.1 }}
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
                  className="absolute right-0 top-10 z-40 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                >
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
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
          className="flex items-center justify-between py-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.7, duration: 0.3 }}
        >
          <div className="flex items-center text-gray-600">
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-sm">Weight</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{pet.weight}</span>
        </motion.div>

        <motion.div
          className="flex items-center justify-between py-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.8, duration: 0.3 }}
        >
          <div className="flex items-center text-gray-600">
            <Heart className="w-4 h-4 mr-2" />
            <span className="text-sm">Last Visit</span>
          </div>
          {pet.lastVisit ? (
            <span className="text-sm font-medium text-gray-900">{pet.lastVisit?.toLocaleDateString()}</span>
          ) : (
            <Link
              href="/guardian/pets/appointments"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Schedule Visit
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Status indicators */}
      <motion.div
        className="px-6 pb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 1.0, duration: 0.3 }}
      >
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {pet.nextVisit && (
              <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
                <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
                <span>Next: {pet.nextVisit?.toLocaleDateString()}</span>
              </motion.div>
            )}
          </div>

          {pet.microchipId && (
            <motion.div
              className="flex items-center text-green-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 1.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-3 h-3 mr-1.5" />
              <span className="text-xs font-medium">Microchipped</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Action Button - matching the design system */}
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
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-medium text-white shadow-sm"
            whileHover={{
              scale: 1.01,
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.99 }}
          >
            <span>View Health Dashboard</span>
            <motion.div initial={{ x: 0 }} whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default PetCard
