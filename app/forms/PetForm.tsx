import React, { FC } from 'react'
import { GENDER_OPTIONS, PET_TYPES, SPAY_NEUTER_OPTIONS } from '../lib/constants/public/pet'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, FileText, Phone, Shield, Stethoscope, User, Weight } from 'lucide-react'
import { petCreateTokenCost, petUpdateTokenCost } from '../lib/constants/public/token'
import FixedFooter from '../components/common/forms/FixedFooter'
import { IForm } from '../types'
import { getCurrentBreeds } from '../lib/utils'
import { containerVariants, itemVariants } from '../lib/constants'
import { isPetFormValid } from '../validations/validatePetForm'

const PetForm: FC<IForm> = ({ inputs, errors, handleInput, close, handleSubmit, loading, isUpdating }) => {
  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Basic Information Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div className="space-y-6">
              {/* Pet Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                <input
                  type="text"
                  name="name"
                  value={inputs?.name || ''}
                  onChange={handleInput}
                  placeholder="Enter your pet's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <AnimatePresence>
                  {errors?.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-red-500 mt-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Pet Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Pet Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {PET_TYPES.map((type) => (
                    <motion.label
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                        inputs?.type === type.id
                          ? `${type.color} shadow-md`
                          : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                      }`}
                    >
                      <input type="radio" name="type" value={type.id} onChange={handleInput} className="hidden" />
                      <div>
                        <span className="text-2xl mb-2 block">{type.icon}</span>
                        <p className="font-medium">{type.name}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>
                <AnimatePresence>
                  {errors?.type && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-red-500 mt-1"
                    >
                      {errors.type}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Breed *</label>
                <input
                  type="text"
                  name="breed"
                  value={inputs?.breed || ''}
                  onChange={handleInput}
                  placeholder="Enter breed (e.g., Golden Retriever)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  list="breeds"
                />
                <datalist id="breeds">
                  {getCurrentBreeds(inputs).map((breed) => (
                    <option key={breed} value={breed} />
                  ))}
                </datalist>
                {inputs?.type && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-wrap gap-2 mt-3"
                  >
                    {getCurrentBreeds(inputs)
                      .slice(0, 4)
                      .map((breed) => (
                        <motion.button
                          key={breed}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInput({ target: { name: 'breed', value: breed } })}
                          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 rounded-full transition-colors font-medium"
                        >
                          {breed}
                        </motion.button>
                      ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Physical Details Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Weight className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Physical Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="relative">
                  <input
                    type="text"
                    name="age"
                    value={inputs?.age || ''}
                    onChange={handleInput}
                    placeholder="e.g., 2 years, 6 months"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  />
                  <Calendar className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="text"
                    name="weight"
                    value={inputs?.weight || ''}
                    onChange={handleInput}
                    placeholder="e.g., 45 lbs, 12 kg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  />
                  <Weight className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Gender */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {GENDER_OPTIONS.map((gender) => (
                    <motion.label
                      key={gender.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                        inputs?.gender === gender.id
                          ? `${gender.color} shadow-md`
                          : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                      }`}
                    >
                      <input type="radio" name="gender" value={gender.id} onChange={handleInput} className="hidden" />
                      <div>
                        <span className="text-xl mb-2 block">{gender.icon}</span>
                        <p className="font-medium">{gender.name}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Spay/Neuter Status */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">Spayed/Neutered</label>
                <div className="grid grid-cols-3 gap-3">
                  {SPAY_NEUTER_OPTIONS.map((option) => (
                    <motion.label
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        inputs?.spayedNeutered === option.id
                          ? `${option.color} shadow-md`
                          : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="radio"
                        name="spayedNeutered"
                        value={option.id}
                        onChange={handleInput}
                        className="hidden"
                      />
                      <p className="font-medium text-sm">{option.name}</p>
                    </motion.label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Health Information Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Health Information</h3>
            </div>

            <div className="space-y-6">
              {/* Microchip ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microchip ID
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="microchipId"
                    value={inputs?.microchipId || ''}
                    onChange={handleInput}
                    placeholder="Enter microchip number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  />
                  <Shield className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Allergies
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  name="allergies"
                  value={inputs?.allergies || ''}
                  onChange={handleInput}
                  placeholder="List any known allergies (food, environmental, medications, etc.)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Emergency Contact Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={inputs?.emergencyContactName || ''}
                  onChange={handleInput}
                  placeholder="Full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={inputs?.emergencyContactPhone || ''}
                  onChange={handleInput}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Additional Notes Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Notes
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                name="notes"
                value={inputs?.notes || ''}
                onChange={handleInput}
                placeholder="Personality traits, behavioral notes, special care instructions, favorite activities, etc."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fixed Footer */}
      <FixedFooter
        inputs={inputs}
        loading={loading}
        tokens={isUpdating ? petUpdateTokenCost : petCreateTokenCost}
        text="Pet"
        close={close}
        func={() => isPetFormValid(inputs)}
        isUpdating={isUpdating}
      />
    </form>
  )
}

export default PetForm
