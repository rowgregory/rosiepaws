import React, { FC } from 'react'
import { INTAKE_TYPES } from '../lib/constants/water'
import { getWaterMoodDescription, isWaterFormValid } from '@/app/lib/utils/water'
import { MOOD_EMOJIS } from '@/app/lib/constants'
import { IForm } from '../types'
import PetSelection from '../components/common/forms/PetSelection'
import FixedFooter from '../components/common/forms/FixedFooter'
import { waterCreateTokenCost } from '../lib/constants/token'
import Notes from '../components/common/forms/Notes'
import TimeRecorded from '../components/common/forms/TimeRecorded'

const WaterForm: FC<IForm> = ({ inputs, handleInput, close, handleSubmit, loading, pets, errors }) => {
  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <PetSelection pets={pets} errors={errors} handleInput={handleInput} inputs={inputs} formName="waterForm" />

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
            <p className="text-center text-sm text-gray-600">{getWaterMoodDescription(parseInt(inputs?.moodRating))}</p>
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
        tokens={waterCreateTokenCost}
        text="Water"
        close={close}
        func={() => isWaterFormValid(inputs)}
      />
    </form>
  )
}

export default WaterForm
