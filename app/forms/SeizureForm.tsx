import React, { FC, useState } from 'react'
import { AlertTriangle, Clock, Video, Upload, X, Brain, Activity, Zap, Timer } from 'lucide-react'
import PetSelection from '../components/common/forms/PetSelection'
import { isSeizureFormValid } from '../validations/validateSeizureForm'
import { IForm } from '../types'
import FixedFooter from '../components/common/forms/FixedFooter'
import { seizureCreateTokenCost, seizureUpdateTokenCost } from '../lib/constants/public/token'
import Notes from '../components/common/forms/Notes'
import TimeRecorded from '../components/common/forms/TimeRecorded'
import { AnimatePresence, motion } from 'framer-motion'
import { commonTriggers, containerVariants, itemVariants, seizureTypeOptions, severityOptions } from '../lib/constants'
import { formatDuration } from '../lib/utils'

const SeizureForm: FC<IForm> = ({
  inputs,
  errors,
  handleInput,
  close,
  handleSubmit,
  loading,
  uploadingVideo = false,
  isUpdating
}) => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const duration = parseFloat(inputs?.duration) || 0
  const showEmergencyAlert = duration === 5

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedVideo(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
      // Store file reference for later upload
      handleInput({ target: { name: 'videoFile', value: file } })
    }
  }

  const removeVideo = () => {
    setSelectedVideo(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideoPreview(null)
    handleInput({ target: { name: 'videoFile', value: null } })
    handleInput({ target: { name: 'videoUrl', value: '' } })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col min-h-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-200px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <motion.div variants={itemVariants}>
            <PetSelection inputs={inputs} errors={errors} handleInput={handleInput} formName="seizureForm" />
          </motion.div>

          {/* Seizure Type */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Seizure Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {seizureTypeOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleInput({ target: { name: 'seizureType', value: option.value } })}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    inputs?.seizureType === option.value || (!inputs?.seizureType && option.value === 'GENERALIZED')
                      ? option.color
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{option.icon}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-75">{option.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Severity */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Severity Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {severityOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInput({ target: { name: 'severity', value: option.value } })}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    inputs?.severity === option.value || (!inputs?.severity && option.value === 'MILD')
                      ? option.color
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-75 mt-1">{option.description}</div>
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full mx-0.5 ${i < option.intensity ? 'bg-current' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Duration */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration (minutes)
            </label>

            <div className="space-y-4">
              {/* Duration Display */}
              <div className="text-center">
                <motion.div
                  key={inputs?.duration || 0}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-3xl font-bold transition-colors ${
                    (inputs?.duration || 0) >= 300 // 5 minutes in seconds
                      ? 'text-red-600'
                      : (inputs?.duration || 0) >= 120 // 2 minutes in seconds
                        ? 'text-orange-600'
                        : 'text-indigo-600'
                  }`}
                >
                  {formatDuration(inputs?.duration || 0)}
                </motion.div>
                <div className="text-sm text-gray-500">duration</div>
              </div>

              {/* Slider */}
              <div className="relative">
                <input
                  type="range"
                  name="duration"
                  value={(inputs?.duration || 0) / 60} // Convert seconds to minutes for slider
                  onChange={(e) => {
                    const minutesValue = parseFloat(e.target.value)
                    const secondsValue = Math.round(minutesValue * 60) // Convert minutes to seconds
                    handleInput({
                      target: {
                        name: 'duration',
                        value: secondsValue
                      }
                    })
                  }}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #8b5cf6 20%, #a855f7 40%, #ec4899 60%, #ef4444 80%, #dc2626 100%)`
                  }}
                />

                {/* Slider markers */}
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span className="text-red-500 font-medium">5</span>
                </div>
                <div className="text-center text-xs text-gray-500 mt-1">minutes</div>
              </div>
            </div>

            {/* Emergency Alert */}
            <AnimatePresence>
              {duration >= 300 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Emergency:</span> Seizures lasting 5 minutes require immediate
                    veterinary care.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trigger Factor */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Potential Trigger (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {commonTriggers.map((trigger, index) => {
                const isSelected = inputs?.triggerFactor === trigger
                return (
                  <motion.button
                    key={trigger}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInput({ target: { name: 'triggerFactor', value: isSelected ? '' : trigger } })}
                    className={`p-2 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {trigger}
                  </motion.button>
                )
              })}
            </div>

            {/* Custom trigger input */}
            <div className="mt-3">
              <input
                type="text"
                name="triggerFactor"
                value={inputs?.triggerFactor || ''}
                onChange={handleInput}
                placeholder="Or describe a custom trigger..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </motion.div>

          {/* Recovery Time */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Recovery Time (minutes)
            </label>
            <div className="space-y-4">
              <div className="text-center">
                <motion.div
                  key={inputs?.recoveryTime}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-blue-600"
                >
                  {inputs?.recoveryTime || 0}
                </motion.div>
                <div className="text-sm text-gray-500">minutes to normal behavior</div>
              </div>

              <input
                type="range"
                name="recoveryTime"
                value={inputs?.recoveryTime || 0}
                onChange={handleInput}
                min="0"
                max="120"
                step="5"
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-400 to-blue-500"
              />

              <div className="flex justify-between text-xs text-gray-400">
                <span>0 min</span>
                <span>30 min</span>
                <span>60 min</span>
                <span>120 min</span>
              </div>
            </div>
          </motion.div>

          {/* Video Upload */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Upload Video <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            <AnimatePresence mode="wait">
              {!selectedVideo && !videoPreview ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload a video</p>
                    <p className="text-xs text-gray-400 mt-1">Helps veterinarians diagnose seizure type</p>
                  </label>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative"
                >
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-indigo-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedVideo?.name}</p>
                          <p className="text-xs text-gray-500">
                            {selectedVideo ? `${(selectedVideo.size / 1024 / 1024).toFixed(1)} MB` : 'Video selected'}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        onClick={removeVideo}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </motion.button>
                    </div>
                    {videoPreview && (
                      <motion.video
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        src={videoPreview}
                        controls
                        className="w-full mt-3 rounded-lg max-h-40"
                      >
                        Your browser does not support video playback.
                      </motion.video>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Time Recorded */}
          <motion.div variants={itemVariants}>
            <TimeRecorded errors={errors} handleInput={handleInput} inputs={inputs} />
          </motion.div>

          {/* Notes */}
          <motion.div variants={itemVariants}>
            <Notes inputs={inputs} handleInput={handleInput} />
          </motion.div>

          {/* Emergency Alert */}
          <AnimatePresence>
            {showEmergencyAlert && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="bg-red-100 border-2 border-red-300 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Seek Immediate Veterinary Care</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Your pet&apos;s seizure duration or frequency indicates a medical emergency. Contact your
                      veterinarian or emergency clinic immediately.
                    </p>
                    <div className="flex flex-col gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        📞 Call Emergency Vet
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Footer */}
      <FixedFooter
        inputs={inputs}
        loading={loading || uploadingVideo}
        tokens={isUpdating ? seizureUpdateTokenCost : seizureCreateTokenCost}
        text="Seizure"
        close={close}
        func={() => isSeizureFormValid(inputs)}
        isUpdating={isUpdating}
      />
    </motion.form>
  )
}

export default SeizureForm
