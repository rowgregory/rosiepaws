import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { Pet } from '@/app/types/entities'
import { motion, AnimatePresence } from 'framer-motion'
import { PawPrint, Plus } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'
import TokenCounter from '../TokenCounter'
import { petCreateTokenCost } from '@/app/lib/constants/public/token'

interface IPetDropdownMenu {
  setOpenPetDrawer: () => void
  setPetDropdownOpen: (petDropdownOpen: boolean) => void
  pets: Pet[]
  dispatch: any
  pet: Pet
  petDropdownOpen: boolean
  handlePetSelect: any
  zeroPets: boolean
  user: any
}

const dropdownVariants: any = {
  hidden: {
    opacity: 0,
    height: 0,
    y: 20,
    scaleY: 0,
    transformOrigin: 'bottom'
  },
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
    scaleY: 1,
    transformOrigin: 'bottom',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
      height: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      },
      opacity: {
        duration: 0.2,
        delay: 0.1
      },
      staggerChildren: 0.05,
      delayChildren: 0.15
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    y: 20,
    scaleY: 0,
    transformOrigin: 'bottom',
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
      height: {
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.05
      },
      opacity: {
        duration: 0.15
      }
    }
  }
}

const itemVariants: any = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

const PetDropdownMenu: FC<IPetDropdownMenu> = ({
  setOpenPetDrawer,
  setPetDropdownOpen,
  pets,
  dispatch,
  pet,
  petDropdownOpen,
  handlePetSelect,
  zeroPets,
  user
}) => {
  const userRole = user?.role?.toLowerCase()
  return (
    <AnimatePresence mode="wait">
      {petDropdownOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setPetDropdownOpen(!petDropdownOpen)}
          />
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-20 left-4 right-4 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-[70] max-h-64 w-64 overflow-hidden"
          >
            {/* Pets List Container */}
            <div className="max-h-48 overflow-y-auto">
              <div className={`${zeroPets ? '' : 'p-2'}`}>
                {pets.map((petItem: Pet, index: number) => (
                  <motion.div
                    key={petItem.id || index}
                    variants={itemVariants}
                    onClick={() => handlePetSelect(petItem)}
                    className={`flex items-center gap-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      pet?.id === petItem.id ? 'bg-gray-100 text-pink-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pet?.id === petItem.id
                          ? 'bg-gradient-to-r from-pink-400 via-orange-400 to-red-400'
                          : 'bg-purple-100'
                      }`}
                      whileHover={{
                        rotate: pet?.id === petItem.id ? 0 : 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <PawPrint className={`w-4 h-4 ${pet?.id === petItem.id ? 'text-white' : 'text-purple-600'}`} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{petItem.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{petItem.breed || 'Unknown breed'}</p>
                    </div>
                    {pet?.id === petItem.id && (
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-pink-400 via-orange-400 to-red-400 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Add New Pet Option */}
            <motion.div variants={itemVariants} className={`${zeroPets ? '' : 'border-t border-gray-100  p-2'}`}>
              <Link
                href={userRole !== 'free' && !user?.isFreeUser ? '/guardian/pets/my-pets' : ''}
                className="block"
                onClick={() => {
                  if (
                    (userRole === 'free' && user?.isFreeUser && user?.pets?.length === 1) ||
                    (userRole === 'comfort' && user?.isComfortUser && user?.pets?.length === 3)
                  ) {
                    dispatch(setOpenNeedToUpgradeDrawer())
                  } else {
                    dispatch(setOpenPetDrawer())
                  }
                  setPetDropdownOpen(false)
                }}
              >
                <motion.div
                  className="flex items-center gap-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors duration-200"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: 'rgb(249 250 251)',
                    transition: { duration: 0.1 }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-100 via-orange-100 to-red-100 flex items-center justify-center"
                    whileHover={{
                      rotate: 90,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Plus className="w-4 h-4 text-pink-600" />
                  </motion.div>
                  <div className="flex-1 flex items-center gap-x-1">
                    <h3 className="text-sm font-medium">Create Pet Profile</h3>
                    {user?.isLegacyUser ? (
                      <span>♾️</span>
                    ) : (
                      <TokenCounter tokens={petCreateTokenCost} id="pink-to-orange" color1="#ed4797" color2="#f97320" />
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PetDropdownMenu
