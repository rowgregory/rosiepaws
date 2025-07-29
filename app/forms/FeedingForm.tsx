import React, { FC } from 'react'
import { RootState, useAppSelector } from '../redux/store'
import { AMOUNTS, FOOD_TYPES, POPULAR_BRANDS } from '@/app/lib/constants/public/feeding'
import { isFeedingFormValid } from '@/app/lib/utils/public/my-pets/feedings/statsUtils'
import { MOOD_EMOJIS } from '@/app/lib/constants'
import { IForm } from '../types'
import FixedFooter from '../components/common/forms/FixedFooter'
import { feedingCreateTokenCost } from '../lib/constants/public/token'
import PetSelection from '../components/common/forms/PetSelection'
import Notes from '../components/common/forms/Notes'
import TimeRecorded from '../components/common/forms/TimeRecorded'
import { getFeedingMoodDescription } from '../lib/utils'

const FeedingForm: FC<IForm> = ({ inputs, handleInput, close, handleSubmit, loading, errors }) => {
  const { pets } = useAppSelector((state: RootState) => state.pet)

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <PetSelection pets={pets} inputs={inputs} errors={errors} handleInput={handleInput} formName="feedingForm" />

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
            <label className="text-sm font-medium text-gray-700">Brand/Type</label>
            <div className="grid grid-cols-3 gap-2">
              {POPULAR_BRANDS.map((brand) => (
                <label
                  key={brand.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    inputs?.brand === brand.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <input type="radio" name="brand" value={brand.id} onChange={handleInput} className="hidden" />
                  <div>
                    <span className="text-lg mb-1 block">{brand.icon}</span>
                    <p className="font-medium text-xs">{brand.name}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Show text input if "Other" is selected */}
            {inputs?.ingredients === 'other' && (
              <input
                type="text"
                name="ingredients"
                value={inputs?.ingredients || ''}
                onChange={handleInput}
                placeholder="Specify what you fed them..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
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
                    parseInt(inputs?.moodRating) === index ? 'bg-yellow-200 shadow-lg scale-110' : 'hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="moodRating"
                    value={index}
                    checked={+inputs?.moodRating === index || false}
                    onChange={handleInput}
                    className="sr-only"
                  />
                  <span>{emoji}</span>
                </label>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">{getFeedingMoodDescription(inputs?.moodRating)}</p>
          </div>

          {/* Time Recorded */}
          <TimeRecorded errors={errors} handleInput={handleInput} inputs={inputs} />

          {/* Notes */}
          <Notes inputs={inputs} handleInput={handleInput} />
        </div>
      </div>

      {/* Fixed Footer */}
      <FixedFooter
        inputs={inputs}
        loading={loading}
        tokens={feedingCreateTokenCost}
        text="Feeding"
        close={close}
        func={() => isFeedingFormValid(inputs)}
      />
    </form>
  )
}

export default FeedingForm
