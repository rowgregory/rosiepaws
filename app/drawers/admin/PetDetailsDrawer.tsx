import { FC, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Heart,
  Calendar,
  Activity,
  Stethoscope,
  Pill,
  Utensils,
  Zap,
  Droplets,
  Footprints,
  Camera,
  TrendingUp,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setClosePetDetailsDrawer } from '@/app/redux/features/adminSlice'
import Picture from '@/app/components/common/Picture'

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt?: string
}

const ImageLightbox: FC<ImageLightboxProps> = ({ isOpen, onClose, imageSrc }) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70] p-4"
          onClick={onClose}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200 text-white z-10"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Image */}
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            src={imageSrc}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const PetDetailsDrawer = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const dispatch = useAppDispatch()
  const { petDetailsDrawer, pet } = useAppSelector((state: RootState) => state.admin)
  const onClose = () => dispatch(setClosePetDetailsDrawer())
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Not scheduled'
  }

  const formatDateTime = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleString() : 'Never'
  }

  const getGenderIcon = (gender: string) => {
    return gender.toLowerCase() === 'male' ? '♂' : gender.toLowerCase() === 'female' ? '♀' : '?'
  }

  const getSpayNeuterStatus = (status: string) => {
    const isFixed =
      status.toLowerCase().includes('yes') ||
      status.toLowerCase().includes('spayed') ||
      status.toLowerCase().includes('neutered')
    return isFixed ? 'Yes' : 'No'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'health', label: 'Health', icon: Stethoscope }
  ]

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
    setLightboxOpen(true)
  }

  return (
    <>
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc={selectedImage}
        imageAlt="Description"
      />

      <AnimatePresence>
        {petDetailsDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="bg-white px-6 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-end mb-4">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Pet Basic Info */}
                  <div className="flex items-center gap-4">
                    {pet?.filePath ? (
                      <Picture
                        onClick={() => handleImageClick(pet?.filePath)}
                        src={pet?.filePath}
                        priority={false}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                      <p className="text-gray-600">
                        {pet.breed} {getGenderIcon(pet.gender)} • {pet.age} • {pet.weight}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">Owner: {pet.owner.name || pet.owner.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{pet._count?.feedings || 0}</div>
                      <div className="text-xs text-gray-500">Feedings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{pet._count?.medications || 0}</div>
                      <div className="text-xs text-gray-500">Medications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{pet._count?.movements || 0}</div>
                      <div className="text-xs text-gray-500">Movements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{pet._count?.painScores || 0}</div>
                      <div className="text-xs text-gray-500">Pain Scores</div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab, index) => {
                      const TabIcon = tab.icon
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 space-y-6"
                      >
                        {/* Basic Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Pet ID</label>
                              <p className="text-sm text-gray-900 font-mono">{pet.id}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Type</label>
                              <p className="text-sm text-gray-900">{pet.type}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Breed</label>
                              <p className="text-sm text-gray-900">{pet.breed}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Age</label>
                              <p className="text-sm text-gray-900">{pet.age}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Gender</label>
                              <p className="text-sm text-gray-900">
                                {pet.gender} {getGenderIcon(pet.gender)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Weight</label>
                              <p className="text-sm text-gray-900">{pet.weight}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Spayed/Neutered</label>
                              <p className="text-sm text-gray-900">{getSpayNeuterStatus(pet.spayedNeutered)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Microchip ID</label>
                              <p className="text-sm text-gray-900">{pet.microchipId || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Medical Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Last Vet Visit</label>
                              <p className="text-sm text-gray-900">{formatDate(pet.lastVisit)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Next Vet Visit</label>
                              <p className="text-sm text-gray-900">{formatDate(pet.nextVisit)}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-500">Allergies</label>
                              <p className="text-sm text-gray-900">{pet.allergies || 'None reported'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Emergency Contact */}
                        {(pet.emergencyContactName || pet.emergencyContactPhone) && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <p className="text-sm text-gray-900">{pet.emergencyContactName || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-sm text-gray-900">{pet.emergencyContactPhone || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {pet.notes && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{pet.notes}</p>
                          </div>
                        )}

                        {/* Account Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Created</label>
                              <p className="text-sm text-gray-900">{formatDate(pet.createdAt)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Last Updated</label>
                              <p className="text-sm text-gray-900">{formatDate(pet.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                      <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 space-y-6"
                      >
                        {/* Activity Summary */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <Utensils className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-blue-600">{pet._count?.feedings || 0}</div>
                              <div className="text-sm text-blue-700">Feedings</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <Droplets className="w-6 h-6 text-green-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-green-600">{pet._count?.waters || 0}</div>
                              <div className="text-sm text-green-700">Water Records</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <Footprints className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-purple-600">{pet._count?.movements || 0}</div>
                              <div className="text-sm text-purple-700">Movements</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                              <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-orange-600">{pet._count?.movements || 0}</div>
                              <div className="text-sm text-orange-700">Movements</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                              <Zap className="w-6 h-6 text-red-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-red-600">{pet._count?.seizures || 0}</div>
                              <div className="text-sm text-red-700">Seizures</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <Camera className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-gray-600">{pet._count?.galleryItems || 0}</div>
                              <div className="text-sm text-gray-700">Gallery Items</div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        {pet.feedings && pet.feedings.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedings</h3>
                            <div className="space-y-3">
                              {pet.feedings.slice(0, 3).map((feeding: any, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <Utensils className="w-4 h-4 text-blue-600" />
                                    <div>
                                      <span className="text-sm font-medium">
                                        {feeding.foodAmount} {feeding.foodType}
                                      </span>
                                      <p className="text-xs text-gray-600">{feeding.brand}</p>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">{formatDateTime(feeding.timeRecorded)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recent Movements */}
                        {pet.movements && pet.movements.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Movements</h3>
                            <div className="space-y-3">
                              {pet.movements.slice(0, 3).map((movement: any, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <Footprints className="w-4 h-4 text-purple-600" />
                                    <div>
                                      <span className="text-sm font-medium">{movement.duration} minutes</span>
                                      <p className="text-xs text-gray-600">Mood: {movement.moodRating}/10</p>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">{formatDateTime(movement.timeRecorded)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Health Tab */}
                    {activeTab === 'health' && (
                      <motion.div
                        key="health"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 space-y-6"
                      >
                        {/* Health Summary */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-red-600">{pet._count?.painScores || 0}</div>
                              <div className="text-sm text-red-700">Pain Scores</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <Pill className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-blue-600">{pet._count?.medications || 0}</div>
                              <div className="text-sm text-blue-700">Medications</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                              <div className="text-xl font-bold text-green-600">{pet._count?.appointments || 0}</div>
                              <div className="text-sm text-green-700">Appointments</div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Pain Scores */}
                        {pet.painScores && pet.painScores.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Pain Scores</h3>
                            <div className="space-y-3">
                              {pet.painScores.slice(0, 5).map((score: any, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                    <div>
                                      <span className="text-sm font-medium">Pain Level: {score.painLevel}/10</span>
                                      <p className="text-xs text-gray-600">{score.location}</p>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">{formatDateTime(score.timeRecorded)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Current Medications */}
                        {pet.medications && pet.medications.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                            <div className="space-y-3">
                              {pet.medications.slice(0, 5).map((medication: any, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <Pill className="w-4 h-4 text-blue-600" />
                                    <div>
                                      <span className="text-sm font-medium">{medication.drugName}</span>
                                      <p className="text-xs text-gray-600">
                                        {medication.dosage} {medication.dosageUnit}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">{medication.frequency}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PetDetailsDrawer
