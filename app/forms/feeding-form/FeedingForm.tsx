import React, { FC } from 'react'
import { RootState, useAppSelector } from '../../redux/store'
import { CheckCircle2 } from 'lucide-react'
import { AMOUNTS, FOOD_TYPES, getMoodDescription, MOOD_EMOJIS } from './constants'
import { QUICK_TIMES } from '@/app/lib/utils/date'
import { IForm } from '@/app/types/common.types'

const FeedingForm: FC<IForm> = ({ inputs, handleInput, close, handleSubmit, loading }) => {
  const { pets } = useAppSelector((state: RootState) => state.pet)

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
                      <p className="text-13 text-gray-500">{pet.type}</p>
                    </div>
                    {inputs?.petId === pet.id && <CheckCircle2 className="text-indigo-500 ml-auto" size={20} />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Food Type</label>
            <div className="grid grid-cols-3 gap-2">
              {FOOD_TYPES.map((food) => (
                <label
                  key={food.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    inputs?.foodType === food.id
                      ? `${food.color} border-current`
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <input type="radio" name="foodType" value={food.id} onChange={handleInput} className="hidden" />
                  <div>
                    <span className="text-2xl mb-1 block">{food.icon}</span>
                    <p className="font-medium text-xs">{food.name}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <div className="grid grid-cols-4 gap-2">
              {AMOUNTS.map((amount) => (
                <label
                  key={amount.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    inputs?.foodAmount === amount.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <input type="radio" name="foodAmount" value={amount.id} onChange={handleInput} className="hidden" />
                  <div>
                    <div className="text-lg mb-1 text-indigo-600 font-mono">{amount.visual}</div>
                    <p className="font-medium text-xs text-gray-800">{amount.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Time Fed</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {QUICK_TIMES.map((time, index) => (
                <label
                  key={index}
                  className={`p-2 rounded-lg border cursor-pointer text-sm transition-all text-center ${
                    inputs?.timeFed === time.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <input type="radio" name="timeFed" value={time.value} onChange={handleInput} className="hidden" />
                  {time.label}
                </label>
              ))}
            </div>

            <input
              type="datetime-local"
              name="timeFed"
              value={inputs?.timeFed || ''}
              onChange={handleInput}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">😋</span>
              How excited were they?
            </h3>
            <div className="flex justify-center space-x-2">
              {MOOD_EMOJIS.map((emoji, index) => (
                <label
                  key={index}
                  className={`p-3 rounded-full transition-all transform hover:scale-110 cursor-pointer text-2xl ${
                    +inputs?.moodRating === index ? 'bg-yellow-200 shadow-lg scale-110' : 'hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="moodRating"
                    value={index}
                    checked={+inputs?.moodRating === index}
                    onChange={handleInput}
                    className="sr-only"
                  />
                  <span>{emoji}</span>
                </label>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">{getMoodDescription(+inputs?.moodRating)}</p>
          </div>

          <div className="space-y-3">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={inputs?.notes || ''}
              onChange={handleInput}
              placeholder="Any observations about appetite, behavior, etc."
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
          disabled={
            !inputs?.petId || !inputs?.foodType || !inputs?.foodAmount || !inputs?.timeFed || !inputs?.moodRating
          }
          className="bg-gradient-to-r from-purple-500 to-pink-500 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-x-2 min-w-[100px] hover:from-purple-600 hover:to-pink-600 transition-all disabled:hover:from-gray-300 disabled:hover:to-gray-400"
        >
          Add{loading && 'ing'} feeding
        </button>
      </div>
    </form>
  )
}

export default FeedingForm
