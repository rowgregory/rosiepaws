import React, { FC } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { getMoodDescription, INTAKE_TYPES, MOOD_EMOJIS, RELATIVE_AMOUNTS } from './constants'
import { IForm } from '@/app/types/common.types'
import { Pet } from '@/app/types/model.types'
import { QUICK_TIMES } from '../pain-score-form/constants'

interface IWaterForm extends IForm {
  pets: Pet[]
  errors: any
}

const WaterForm: FC<IWaterForm> = ({ inputs, handleInput, close, handleSubmit, loading, pets }) => {
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
                      <p className="text-xs text-gray-500">{pet.type}</p>
                    </div>
                    {inputs?.petId === pet.id && <CheckCircle2 className="text-indigo-500 ml-auto" size={20} />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Intake Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Measurement Type</label>
            <div className="grid grid-cols-2 gap-2">
              {INTAKE_TYPES.map((type) => (
                <label
                  key={type.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    inputs?.intakeType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <input type="radio" name="intakeType" value={type.id} onChange={handleInput} className="hidden" />
                  <div>
                    <span className="text-2xl mb-1 block">{type.icon}</span>
                    <p className="font-medium text-xs">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Amount Input - Conditional */}
          {inputs?.intakeType === 'milliliters' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Amount (mL)</label>
              <div className="relative">
                <input
                  type="number"
                  name="milliliters"
                  value={inputs?.milliliters}
                  onChange={handleInput}
                  placeholder="Enter amount in milliliters"
                  min="0"
                  step="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">mL</span>
              </div>
            </div>
          )}

          {inputs?.intakeType === 'relative' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Relative Amount</label>
              <div className="grid grid-cols-1 gap-2">
                {RELATIVE_AMOUNTS.map((amount) => (
                  <label
                    key={amount.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                      inputs?.relativeIntake === amount.id
                        ? amount.color
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="relativeIntake"
                      value={amount.id}
                      onChange={handleInput}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{amount.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{amount.label}</p>
                      </div>
                      {inputs?.relativeIntake === amount.id && (
                        <CheckCircle2 className="text-current ml-auto" size={18} />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Time Recorded */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Time Recorded</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {QUICK_TIMES.map((time, index) => (
                <label
                  key={index}
                  className={`p-2 rounded-lg border cursor-pointer text-sm transition-all text-center ${
                    inputs?.timeRecorded === time.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeRecorded"
                    value={time.value}
                    onChange={handleInput}
                    className="hidden"
                  />
                  {time.label}
                </label>
              ))}
            </div>

            <input
              type="datetime-local"
              name="timeRecorded"
              value={inputs?.timeRecorded || ''}
              onChange={handleInput}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Mood Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">💧</span>
              How willing were they to drink?
            </h3>
            <div className="flex justify-center space-x-2">
              {MOOD_EMOJIS.map((emoji, index) => (
                <label
                  key={index}
                  className={`p-3 rounded-full transition-all transform hover:scale-110 cursor-pointer text-2xl ${
                    parseInt(inputs?.moodRating) === index ? 'bg-blue-200 shadow-lg scale-110' : 'hover:bg-gray-100'
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
            <p className="text-center text-sm text-gray-600">{getMoodDescription(parseInt(inputs?.moodRating))}</p>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={inputs?.notes || ''}
              onChange={handleInput}
              placeholder="Any observations about drinking behavior, water preferences, etc."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 border-t border-zinc-200 bg-white pt-4 px-5 pb-5 flex justify-end gap-x-4 flex-shrink-0">
        <button
          type="button"
          onClick={close}
          className="text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1 border border-zinc-300"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-x-2 min-w-[100px] hover:from-blue-600 hover:to-cyan-600 transition-all disabled:hover:from-gray-300 disabled:hover:to-gray-400"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Recording...
            </>
          ) : (
            'Record Intake'
          )}
        </button>
      </div>
    </form>
  )
}

export default WaterForm
