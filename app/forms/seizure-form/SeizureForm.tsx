import React, { FC, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock, Video, Upload, X } from 'lucide-react'
import { IForm } from '../../types/common.types'
import { RootState, useAppSelector } from '@/app/redux/store'
import { QUICK_TIMES } from '../pain-score-form/constants'

interface SeizureFormProps extends IForm {
  onVideoUpload?: (file: File) => Promise<string>
  uploadingVideo?: boolean
}

const SeizureForm: FC<SeizureFormProps> = ({
  inputs,
  errors,
  handleInput,
  close,
  handleSubmit,
  loading,
  uploadingVideo = false
}) => {
  const { pets } = useAppSelector((state: RootState) => state.pet)
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
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Pet</label>
            <div className="grid grid-cols-1 gap-2">
              {pets.map((pet) => (
                <label
                  key={pet.id}
                  className={`p-3 rounded-lg border transition-all text-left cursor-pointer ${
                    inputs?.petId === pet.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <input type="radio" name="petId" value={pet.id} onChange={handleInput} className="hidden" />
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{pet.type === 'DOG' ? '🐶' : '🐱'}</span>
                    <div>
                      <p className="font-medium text-gray-900">{pet.name}</p>
                      <p className="text-xs text-gray-500">{pet.breed}</p>
                    </div>
                    {inputs?.petId === pet.id && <CheckCircle2 className="text-indigo-500 ml-auto" size={20} />}
                  </div>
                </label>
              ))}
            </div>
            {errors?.petId && <p className="text-sm text-red-500">{errors.petId}</p>}
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration (minutes)
            </label>

            <div className="space-y-4">
              {/* Duration Display */}
              <div className="text-center">
                <div
                  className={`text-3xl font-bold transition-colors ${
                    duration === 5 ? 'text-red-600' : 'text-indigo-600'
                  }`}
                >
                  {duration}
                </div>
                <div className="text-sm text-gray-500">minutes</div>
              </div>

              {/* Slider */}
              <div className="relative">
                <input
                  type="range"
                  name="duration"
                  value={inputs?.duration || 0}
                  onChange={handleInput}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right,  #6366f1 0%, #8b5cf6 20%, #a855f7 40%, #ec4899 60%, #ef4444 80%, #dc2626 100%)`
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
              </div>
            </div>

            {/* Emergency Alert */}
            {duration === 5 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  <span className="font-medium">Emergency:</span> Seizures lasting 5 minutes require immediate
                  veterinary care.
                </p>
              </div>
            )}
          </div>
          {/* Time Taken */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Time Taken</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {QUICK_TIMES.map((time, index) => (
                <label
                  key={index}
                  className={`p-2 rounded-lg border cursor-pointer text-sm transition-all text-center ${
                    inputs?.timeTaken === time.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <input type="radio" name="timeTaken" value={time.value} onChange={handleInput} className="hidden" />
                  {time.label}
                </label>
              ))}
            </div>

            <input
              type="datetime-local"
              name="timeTaken"
              value={inputs?.timeTaken || ''}
              onChange={handleInput}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Video Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Upload Video <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            {!selectedVideo && !videoPreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" id="video-upload" />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload a video</p>
                  <p className="text-xs text-gray-400 mt-1">Helps veterinarians diagnose seizure type</p>
                </label>
              </div>
            )}

            {(selectedVideo || videoPreview) && (
              <div className="relative">
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
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {videoPreview && (
                    <video src={videoPreview} controls className="w-full mt-3 rounded-lg max-h-40">
                      Your browser does not support video playback.
                    </video>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={inputs?.notes || ''}
              onChange={handleInput}
              placeholder="Describe what happened before, during, or after the seizure..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
            />
            {errors?.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
          </div>

          {/* Emergency Alert */}
          {showEmergencyAlert && (
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Seek Immediate Veterinary Care</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Your pet&apos;s seizure duration or frequency indicates a medical emergency. Contact your
                    veterinarian or emergency clinic immediately.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      📞 Call Emergency Vet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 border-t border-zinc-200 bg-white pt-4 px-5 pb-5 flex justify-end gap-x-4 flex-shrink-0">
        <button
          type="button"
          onClick={close}
          className="text-sm px-4 py-2 rounded-lg font-medium flex items-center gap-x-2 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadingVideo || !inputs.petId || inputs.duration === '0' || !inputs.timeTaken}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-x-2 min-w-[100px] hover:from-yellow-600 hover:to-orange-600 transition-all disabled:hover:from-gray-300 disabled:hover:to-gray-400"
        >
          Log{loading && 'ing'} Seizure
        </button>
      </div>
    </form>
  )
}

export default SeizureForm
