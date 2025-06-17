'use client'

import React, { FC } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store'
import { CheckCircle2 } from 'lucide-react'
import { PAIN_LEVELS, QUICK_TIMES } from './constants'
import { clearInputs, setErrors } from '@/app/redux/features/formSlice'

interface PainScoreFormProps {
  inputs: any
  errors: any
  handleInput: any
  close: any
  handleSubmit: any
  loading: boolean
}

const PainScoreForm: FC<PainScoreFormProps> = ({ inputs, errors, handleInput, close, handleSubmit, loading }) => {
  const { pets } = useAppSelector((state: RootState) => state.pet)
  const dispatch = useAppDispatch()

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="flex-1 flex flex-col min-h-full">
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
                      inputs.petId === pet.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : errors.petId
                        ? 'border-red-500 bg-red-50'
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
                      {inputs.petId === pet.id && <CheckCircle2 className="text-indigo-500 ml-auto" size={20} />}
                    </div>
                  </label>
                ))}
              </div>
              {errors.petId && <p className="text-red-500 text-sm mt-1">{errors.petId}</p>}
            </div>

            {/* Pain Score Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Pain Level (0-4 Scale)</label>
              <div className="grid grid-cols-1 gap-3">
                {PAIN_LEVELS.map((level) => (
                  <label
                    key={level.score}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                      parseInt(inputs.score) === level.score
                        ? `${level.borderColor} ${level.bgColor}`
                        : errors.score
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input type="radio" name="score" value={level.score} onChange={handleInput} className="hidden" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 ${level.color} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm`}
                        >
                          {level.score}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{level.label}</p>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                      </div>
                      {parseInt(inputs.score) === level.score && (
                        <CheckCircle2 className="text-current ml-auto" size={20} />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Recorded */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Time Assessed</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {QUICK_TIMES.map((time, index) => (
                  <label
                    key={index}
                    className={`p-2 rounded-lg border cursor-pointer text-sm transition-all text-center ${
                      inputs.timeRecorded === time.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : errors.timeRecorded
                        ? 'border-red-500 bg-red-50'
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
                value={inputs.timeRecorded || ''}
                onChange={handleInput}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.timeRecorded ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.timeRecorded && <p className="text-red-500 text-sm mt-1">{errors.timeRecorded}</p>}
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={inputs.notes || ''}
                onChange={handleInput}
                placeholder="Describe symptoms, behavior changes, or triggers..."
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
            onClick={() => {
              dispatch(clearInputs({ formName: 'painScoreForm' }))
              dispatch(setErrors({ formName: 'painScoreForm', errors: {} }))
              close()
            }}
            className="text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1 border border-zinc-300"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-pink-500 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-x-2 min-w-[100px] hover:from-red-600 hover:to-pink-600 transition-all disabled:hover:from-gray-300 disabled:hover:to-gray-400"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Recording...
              </>
            ) : (
              'Record Pain Score'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default PainScoreForm
