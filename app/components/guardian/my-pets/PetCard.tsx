import { setOpenPetDrawer, setSelectedPetWithChartData } from '@/app/redux/features/petSlice'
import { useAppDispatch, useUserSelector } from '@/app/redux/store'
import { Pet } from '@/app/types/entities'
import { Activity, ArrowRight, Edit, Heart, MoreVertical, Shield, Trash2 } from 'lucide-react'
import React, { FC, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { setInputs } from '@/app/redux/features/formSlice'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { useDeletePetMutation } from '@/app/redux/services/petApi'
import { processChartDataForPet } from '@/app/lib/utils/public/dashboard/processChartData'
import { calculatePetStats } from '@/app/lib/utils/public/dashboard/calculatePetStats'
import { appointmentCreateTokenCost, petDeleteTokenCost, petUpdateTokenCost } from '@/app/lib/constants/public/token'
import { useRouter } from 'next/navigation'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenNotEnoughTokensModal } from '@/app/redux/features/appSlice'
import { MotionLink } from '../../common/MotionLink'

const PetCard: FC<{ pet: Pet; index: number }> = ({ pet, index }) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [deletePet] = useDeletePetMutation()
  const menuRef = useRef(null) as any
  const { user } = useUserSelector()
  const { push } = useRouter()

  const handleEdit = () => {
    if ((user?.tokens ?? 0) < petUpdateTokenCost) {
      dispatch(setOpenNotEnoughTokensModal(petUpdateTokenCost))
      return
    }
    dispatch(setOpenPetDrawer())
    dispatch(setInputs({ formName: 'petForm', data: { ...pet, type: pet.type.toLowerCase(), isUpdating: true } }))
    setIsOpen(false)
  }

  const handleDelete = () => {
    if ((user?.tokens ?? 0) < petDeleteTokenCost) {
      dispatch(setOpenNotEnoughTokensModal(petUpdateTokenCost))
      return
    }

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
          isDestructive: true,
          tokenAmount: petDeleteTokenCost
        }
      })
    )
  }

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      {/* Header matching your design pattern */}
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.1, duration: 0.3 }}
        >
          <div className="p-2 bg-gray-100 rounded-lg">
            <Heart className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pet Profile</h3>
        </motion.div>

        <div className="relative" ref={menuRef}>
          <motion.button
            onClick={() => setIsOpen(true)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-8 z-40 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
              >
                <button
                  onClick={handleEdit}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pet name as main metric */}
      <motion.div
        className="space-y-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
      >
        <p className="text-2xl font-bold text-gray-900">{pet.name}</p>
        <p className="text-sm text-gray-500">
          {pet.breed} • {pet.age}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Weight</span>
            <span className="font-medium text-gray-900">{pet.weight}lbs</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last Visit</span>
            {pet.lastVisit ? (
              <span className="font-medium text-gray-900">{pet.lastVisit?.toLocaleDateString()}</span>
            ) : (
              <button
                onClick={() =>
                  user?.isFreeUser
                    ? dispatch(setOpenNeedToUpgradeDrawer())
                    : (user?.tokens ?? 0) < appointmentCreateTokenCost
                      ? dispatch(setOpenNotEnoughTokensModal(appointmentCreateTokenCost))
                      : push('/guardian/pets/appointments')
                }
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Log Visit
              </button>
            )}
          </div>
        </div>

        {/* Status indicators - matching your green indicator pattern */}
        {(pet.nextVisit || pet.microchipId) && (
          <div className="flex items-center gap-4">
            {pet.nextVisit && (
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">Next: {pet.nextVisit?.toLocaleDateString()}</span>
              </div>
            )}

            {pet.microchipId && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">Microchipped</span>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Action Button */}
      <MotionLink
        href="/guardian/dashboard"
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
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
      >
        View {pet?.name}&apos;s Dashboard
        <ArrowRight className="w-4 h-4" />
      </MotionLink>
    </motion.div>
  )
}

export default PetCard
