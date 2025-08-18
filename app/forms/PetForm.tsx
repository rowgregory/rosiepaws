import React, { FC, useMemo, useState } from 'react'
import { GENDER_OPTIONS, PET_TYPES, SPAY_NEUTER_OPTIONS } from '../lib/constants/public/pet'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Calendar,
  Camera,
  FileText,
  ImageIcon,
  Phone,
  Shield,
  Stethoscope,
  Trash2,
  User,
  Weight
} from 'lucide-react'
import { petCreateTokenCost, petUpdateTokenCost } from '../lib/constants/public/token'
import FixedFooter from '../components/common/forms/FixedFooter'
import { IForm } from '../types'
import { getCurrentBreeds } from '../lib/utils'
import { containerVariants } from '../lib/constants'
import { isPetFormValid } from '../validations/validatePetForm'
import Picture from '../components/common/Picture'
import { useAppDispatch } from '../redux/store'
import { setInputs } from '../redux/features/formSlice'

const PetForm: FC<IForm> = ({ inputs, errors, handleInput, close, handleSubmit, loading, isUpdating }) => {
  const dispatch = useAppDispatch()
  const [converting, setConverting] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    let processedFile = file

    const isHEIC =
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif')

    if (isHEIC) {
      setConverting(true)
      try {
        const heic2any = (await import('heic2any')).default
        // Convert HEIC to JPEG
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.6
        })

        // Create a new File object from the converted blob
        const convertedFile = new File([convertedBlob as Blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg'
        })

        processedFile = convertedFile
      } catch {
        alert('Failed to convert HEIC file. Please try a different format.')
        return
      } finally {
        setConverting(false)
      }
    }

    // Handle all file types (HEIC converted files and regular files)
    dispatch(
      setInputs({
        formName: 'petForm',
        data: {
          media: processedFile, // Store the processed file object
          uploadingFile: { name: processedFile.name, progress: 0, isHEIC },
          // Flag that we need to delete the original
          shouldDeleteOriginal: !!inputs?.fileName,
          originalFileName: inputs?.fileName,
          wantsToReplace: true
        }
      })
    )
  }

  const mediaObjectUrl = useMemo(() => {
    if (inputs?.media && inputs.media instanceof File) {
      return URL.createObjectURL(inputs.media)
    }
    return null
  }, [inputs?.media])

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Basic Information</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Pet Name */}
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium text-gray-900">Pet Name *</label>
                <input
                  type="text"
                  name="name"
                  value={inputs?.name || ''}
                  onChange={handleInput}
                  placeholder="Enter pet name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                />
                {errors?.name && <p className="text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>

              {/* Pet Type */}
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium text-gray-900">Pet Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {PET_TYPES.map((type) => {
                    const IconComponent = type.icon
                    const isSelected = inputs?.type?.toLowerCase() === type.id
                    return (
                      <label
                        key={type.id}
                        className={`flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input type="radio" name="type" value={type.id} onChange={handleInput} className="sr-only" />
                        <div className={`p-2 rounded-md ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                          {type.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
                {errors?.type && <p className="text-sm text-red-600 font-medium">{errors.type}</p>}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
          </section>

          {/* Pet Photo/Video Section */}
          <section className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Pet Photo or Video <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </h2>
              </div>
            </div>
            <div className="bg-white p-6">
              {converting ? (
                <div className="w-full h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-pink-600"></div>
                  <p className="text-sm text-gray-600">Converting HEIC...</p>
                </div>
              ) : (inputs?.media && inputs.media instanceof File) || inputs.fileName || inputs.filePath ? (
                <div className="space-y-4">
                  {/* Current Media Display */}
                  <div className="relative">
                    <div className="w-full h-48 overflow-hidden rounded-lg border border-gray-200">
                      {/* If there's a new file being uploaded */}
                      {inputs?.media && inputs.media instanceof File ? (
                        inputs.media.type?.startsWith('video/') ? (
                          <video src={mediaObjectUrl!} className="w-full h-full object-cover" controls />
                        ) : (
                          <Picture
                            priority={false}
                            src={mediaObjectUrl!}
                            alt="Pet preview"
                            className="w-full h-full object-contain"
                          />
                        )
                      ) : (
                        /* Display existing pet media using filePath */
                        inputs.fileName &&
                        inputs.filePath &&
                        (inputs.fileName.toLowerCase().match(/\.(mp4|mov|avi|webm)$/) ? (
                          <video src={inputs.filePath} className="w-full h-full object-cover" controls />
                        ) : (
                          <Picture
                            priority={false}
                            src={inputs.filePath}
                            alt="Pet photo"
                            className="w-full h-full object-contain"
                          />
                        ))
                      )}
                    </div>

                    {/* File Info */}
                    <div className="mt-2 text-sm text-gray-600">
                      {inputs?.media && inputs.media instanceof File ? (
                        <>
                          {inputs.media.name} ({(inputs.media.size / 1024 / 1024).toFixed(1)} MB)
                        </>
                      ) : inputs.fileName ? (
                        <>{inputs.fileName}</>
                      ) : null}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Replace Upload */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative group">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-full h-16 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all group-hover:border-blue-400 group-hover:bg-blue-50">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Replace</span>
                      </div>
                    </motion.div>

                    {/* Remove Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        dispatch(
                          setInputs({
                            formName: 'petForm',
                            data: {
                              shouldDeleteOriginal: !!inputs?.fileName,
                              wantsToRemove: true
                            }
                          })
                        )
                      }}
                      className={`w-full h-16 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-all group ${
                        inputs?.wantsToRemove
                          ? 'border-red-500 bg-red-100 text-red-800'
                          : 'border-red-300 hover:border-red-400 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className={`w-4 h-4 ${inputs?.wantsToRemove ? 'text-red-700' : 'text-red-600'}`} />
                      <span
                        className={`text-xs font-medium ${inputs?.wantsToRemove ? 'text-red-800' : 'text-red-700'}`}
                      >
                        {inputs?.wantsToRemove ? 'Will be removed' : 'Remove'}
                      </span>
                    </motion.button>
                  </div>

                  {/* Info Message */}
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-xs text-gray-600 text-center">
                      Replace to upload a new file, or Remove to delete entirely
                    </p>
                  </div>
                </div>
              ) : (
                /* Initial Upload Section */
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all group-hover:border-blue-400 group-hover:bg-blue-50">
                    <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
                      <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        Click to upload photo or video
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, HEIC, MP4, MOV up to 10MB</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {errors?.media && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.media}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Physical Details Section */}
          <section className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Physical Details</h2>
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age * <span className="text-gray-400 font-normal ml-1">(i.e. 4 yrs 5 months)</span>
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight * <span className="text-gray-400 font-normal ml-1">(lbs)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="weight"
                      value={inputs?.weight || ''}
                      onChange={handleInput}
                      placeholder="e.g., 45"
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
            </div>
          </section>

          {/* Health Information Section */}
          <section className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Health Information</h2>
              </div>
            </div>

            <div className="bg-white p-6 space-y-6">
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
          </section>

          {/* Emergency Contact Section */}
          <section className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Emergency Contact</h2>
              </div>
            </div>

            <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </section>

          {/* Additional Notes Section */}
          <section className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Additonal Information</h2>
              </div>
            </div>

            <div className="bg-white p-6">
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
          </section>
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
