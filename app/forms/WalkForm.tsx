import React, { FC } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  itemVariants,
  MOOD_EMOJIS,
  WALK_CONTAINER_VARIANTS,
  WALK_DISTRACTION_LEVELS,
  WALK_PACE_OPTIONS
} from '@/app/lib/constants'
import { IForm } from '../types'
import PetSelection from '../components/common/forms/PetSelection'
import FixedFooter from '../components/common/forms/FixedFooter'
import { walkCreateTokenCost, walkUpdateTokenCost } from '../lib/constants/public/token'
import Notes from '../components/common/forms/Notes'
import TimeRecorded from '../components/common/forms/TimeRecorded'
import { getWalkMoodDescription } from '../lib/utils'
import { isWalkFormValid } from '../validations/validateWalkForm'

const WalkForm: FC<IForm> = ({ inputs, handleInput, close, handleSubmit, loading, errors, isUpdating }) => {
  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <motion.div variants={WALK_CONTAINER_VARIANTS} initial="hidden" animate="visible" className="space-y-6">
          {/* Pet Selection */}
          <PetSelection inputs={inputs} errors={errors} handleInput={handleInput} formName="walkForm" />

          {/* Distance Input */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Distance</label>
            <div className="relative">
              <input
                type="number"
                name="distance"
                step="0.1"
                min="0"
                value={inputs?.distance || ''}
                onChange={handleInput}
                placeholder="0.0"
                className={`w-full p-4 pr-12 border rounded-xl text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  errors?.distance ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-green-300'
                }`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                mi
              </div>
            </div>
            {errors?.distance && <p className="text-red-500 text-xs">{errors.distance}</p>}
            <div className="flex gap-2 mt-2">
              {[0.5, 1.0, 2.0, 3.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleInput({ target: { name: 'distance', value: preset.toString() } } as any)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-700 rounded-full transition-colors"
                >
                  {preset}mi
                </button>
              ))}
            </div>
          </motion.div>

          {/* Duration Input */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Duration</label>
            <div className="relative">
              <input
                type="number"
                name="duration"
                min="0"
                step="1"
                value={inputs?.duration || ''}
                onChange={handleInput}
                placeholder="0"
                className={`w-full p-4 pr-12 border rounded-xl text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  errors?.duration ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-green-300'
                }`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                min
              </div>
            </div>

            {errors?.duration && <p className="text-red-500 text-xs">{errors?.duration}</p>}

            {/* Duration Presets */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[15, 30, 45, 60, 90, 120].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleInput({ target: { name: 'duration', value: preset.toString() } } as any)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-700 rounded-full transition-colors"
                >
                  {preset > 60 ? `${Math.floor(preset / 60)}h ${preset % 60}m` : `${preset}min`}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Interactive Summary */}
          {(inputs?.distance || inputs?.minutes) && (
            <motion.div variants={itemVariants} className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-900">Walk Summary</h4>
                  <div className="text-sm text-green-700 mt-1">
                    {inputs?.distance && <span className="mr-3">📍 {inputs.distance}mi</span>}
                    {inputs?.minutes && <span>⏱️ {inputs.minutes}min</span>}
                  </div>
                </div>

                {/* Calculated pace if both distance and time are provided */}
                {inputs?.distance && inputs?.minutes && (
                  <div className="text-right">
                    <div className="text-xs text-green-600">Average Pace</div>
                    <div className="font-medium text-green-800">
                      {(() => {
                        const distance = parseFloat(inputs.distance) || 0
                        const totalMinutes = parseInt(inputs.minutes) || 0
                        if (distance > 0 && totalMinutes > 0) {
                          const paceMinPerMi = totalMinutes / distance
                          const paceMin = Math.floor(paceMinPerMi)
                          const paceSec = Math.round((paceMinPerMi - paceMin) * 60)
                          return `${paceMin}:${paceSec.toString().padStart(2, '0')}/mi`
                        }
                        return '--'
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Pace */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Pace</label>
            <div className="grid grid-cols-1 gap-2">
              {WALK_PACE_OPTIONS.map((pace) => (
                <label
                  key={pace.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                    inputs?.pace === pace.id ? pace.color : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <input type="radio" name="pace" value={pace.id} onChange={handleInput} className="hidden" />
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{pace.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{pace.label}</p>
                      <p className="text-xs text-gray-500">{pace.description}</p>
                    </div>
                    {inputs?.pace === pace.id && <CheckCircle2 className="text-current ml-auto" size={18} />}
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Distraction Level */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Distraction Level</label>
            <div className="grid grid-cols-1 gap-2">
              {WALK_DISTRACTION_LEVELS.map((distraction) => (
                <label
                  key={distraction.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                    inputs?.distraction === distraction.id
                      ? distraction.color
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="distraction"
                    value={distraction.id}
                    onChange={handleInput}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{distraction.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{distraction.label}</p>
                      <p className="text-xs text-gray-500">{distraction.description}</p>
                    </div>
                    {inputs?.distraction === distraction.id && (
                      <CheckCircle2 className="text-current ml-auto" size={18} />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Mood Rating */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🚶</span>
              How did they enjoy the walk?
            </h3>
            <div className="flex justify-center space-x-2">
              {MOOD_EMOJIS.map((emoji, index) => (
                <label
                  key={index}
                  className={`p-3 rounded-full transition-all transform hover:scale-110 cursor-pointer text-2xl ${
                    parseInt(inputs?.moodRating) === index ? 'bg-green-200 shadow-lg scale-110' : 'hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="moodRating"
                    value={index}
                    checked={parseInt(inputs?.moodRating) === index}
                    onChange={handleInput}
                    className="sr-only"
                  />
                  <span>{emoji}</span>
                </label>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">{getWalkMoodDescription(parseInt(inputs?.moodRating))}</p>
          </motion.div>

          {/* Time Recorded */}
          <TimeRecorded errors={errors} handleInput={handleInput} inputs={inputs} />

          {/* Notes */}
          <Notes inputs={inputs} handleInput={handleInput} />
        </motion.div>
      </div>

      {/* Fixed Footer */}
      <FixedFooter
        inputs={inputs}
        loading={loading}
        tokens={isUpdating ? walkUpdateTokenCost : walkCreateTokenCost}
        text="Walk"
        close={close}
        func={() => isWalkFormValid(inputs)}
        isUpdating={isUpdating}
      />
    </form>
  )
}

export default WalkForm
