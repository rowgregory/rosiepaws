import React, { FC } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { QUICK_TIMES } from '@/app/lib/utils/date'
import { RootState, useAppSelector } from '@/app/redux/store'
import GuardianNumberWheel from '@/app/components/guardian/GuardianNumberWheel'
import { getBloodSugarRange2 } from './constants'
import { IForm } from '@/app/types/common.types'

const BloodSugarForm: FC<IForm> = ({ inputs, handleInput, close, handleSubmit, loading }) => {
  const { pets } = useAppSelector((state: RootState) => state.pet)
  const value = parseFloat(inputs?.value) || 0
  const currentRange = getBloodSugarRange2(value)

  return (
    <div onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
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
                      <p className="text-13 text-gray-500">{pet.type}</p>
                    </div>
                    {inputs?.petId === pet.id && <CheckCircle2 className="text-indigo-500 ml-auto" size={20} />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Blood Sugar Value */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Blood Sugar Reading (mg/dL)</label>

            <div className="flex justify-center space-x-2">
              <GuardianNumberWheel
                value={Math.floor((value || 0) / 100)}
                onChange={(val: number) => {
                  const tens = Math.floor(((value || 0) % 100) / 10)
                  const ones = (value || 0) % 10
                  const newValue = val * 100 + tens * 10 + ones
                  handleInput({ target: { name: 'value', value: newValue.toString() } })
                }}
                max={3}
                label="Hundreds"
              />
              <GuardianNumberWheel
                value={Math.floor(((value || 0) % 100) / 10)}
                onChange={(val: number) => {
                  const hundreds = Math.floor((value || 0) / 100)
                  const ones = (value || 0) % 10
                  const newValue = hundreds * 100 + val * 10 + ones
                  handleInput({ target: { name: 'value', value: newValue.toString() } })
                }}
                max={9}
                label="Tens"
              />
              <GuardianNumberWheel
                value={(value || 0) % 10}
                onChange={(val: number) => {
                  const hundreds = Math.floor((value || 0) / 100)
                  const tens = Math.floor(((value || 0) % 100) / 10)
                  const newValue = hundreds * 100 + tens * 10 + val
                  handleInput({ target: { name: 'value', value: newValue.toString() } })
                }}
                max={9}
                label="Ones"
              />
            </div>

            {/* Blood Sugar Range Indicator */}
            {value > 0 && currentRange && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border ${currentRange.color} flex items-center space-x-2`}
              >
                <span className="text-lg">{currentRange.emoji}</span>
                <div>
                  <p className="font-medium">{currentRange.label}</p>
                  <p className="text-xs opacity-75">
                    {currentRange.min === 301
                      ? 'Consider contacting your vet immediately'
                      : currentRange.min < 80
                      ? 'Monitor closely and contact vet if symptoms occur'
                      : currentRange.min > 180
                      ? 'May need dietary or medication adjustments'
                      : 'Within normal range'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Large display of current value */}
            {value > 0 && (
              <div className="text-center">
                <motion.div
                  key={value}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-gray-800"
                >
                  {value}
                  <span className="text-lg text-gray-500 ml-2">mg/dL</span>
                </motion.div>
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

          {/* Notes */}
          <div className="space-y-3">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={inputs?.notes || ''}
              onChange={handleInput}
              placeholder="Any observations about your pet's behavior, symptoms, or circumstances..."
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
          className="text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1 border-1 border-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!inputs?.petId || !inputs?.value || !inputs?.timeTaken}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-500 to-pink-500 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-x-2 min-w-[100px] hover:from-purple-600 hover:to-pink-600 transition-all disabled:hover:from-gray-300 disabled:hover:to-gray-400"
        >
          Add{loading && 'ing'} reading
        </button>
      </div>
    </div>
  )
}

export default BloodSugarForm
