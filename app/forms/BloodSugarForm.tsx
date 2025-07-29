import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { RootState, useAppSelector } from '@/app/redux/store'
import GuardianNumberWheel from '@/app/components/guardian/GuardianNumberWheel'
import { IForm } from '../types'
import PetSelection from '../components/common/forms/PetSelection'
import FixedFooter from '../components/common/forms/FixedFooter'
import { bloodSugarCreateTokenCost } from '../lib/constants/public/token'
import Notes from '../components/common/forms/Notes'
import TimeRecorded from '../components/common/forms/TimeRecorded'
import { mealRelationOptions, measurementUnitOptions, symptomsOptions } from '../lib/constants'
import { getBloodSugarRange2, isBloodSugarFormValid } from '../lib/utils'

const BloodSugarForm: FC<IForm> = ({ inputs, handleInput, close, handleSubmit, loading, errors }) => {
  const { pets } = useAppSelector((state: RootState) => state.pet)
  const value = parseFloat(inputs?.value) || 0
  const currentRange = getBloodSugarRange2(value)

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <PetSelection
            pets={pets}
            handleInput={handleInput}
            inputs={inputs}
            errors={errors}
            formName="bloodSugarForm"
          />

          {/* Measurement Unit Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Measurement Unit</label>
            <div className="grid grid-cols-2 gap-3">
              {measurementUnitOptions.map((unit) => (
                <button
                  key={unit.value}
                  type="button"
                  onClick={() => handleInput({ target: { name: 'measurementUnit', value: unit.value } })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    inputs?.measurementUnit === unit.value || (!inputs?.measurementUnit && unit.value === 'MG_DL')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{unit.label}</div>
                  <div className="text-xs opacity-75">{unit.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Blood Sugar Value */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Blood Sugar Reading ({inputs?.measurementUnit === 'MMOL_L' ? 'mmol/L' : 'mg/dL'})
            </label>

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
                    {value < 50
                      ? 'Emergency - Contact vet immediately'
                      : value >= 50 && value <= 79
                        ? 'Monitor closely and contact vet if symptoms occur'
                        : value >= 80 && value <= 150
                          ? 'Within normal range for dogs and cats'
                          : value >= 151 && value <= 200
                            ? 'Monitor diet and medication timing'
                            : value >= 201 && value <= 300
                              ? 'Veterinary consultation recommended'
                              : 'Urgent veterinary attention needed'}
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
                  <span className="text-lg text-gray-500 ml-2">
                    {inputs?.measurementUnit === 'MMOL_L' ? 'mmol/L' : 'mg/dL'}
                  </span>
                </motion.div>
              </div>
            )}
          </div>

          {/* Meal Relation */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">When was this reading taken?</label>
            <div className="grid grid-cols-2 gap-2">
              {mealRelationOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInput({ target: { name: 'mealRelation', value: option.value } })}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    inputs?.mealRelation === option.value || (!inputs?.mealRelation && option.value === 'FASTING')
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Range */}
          <div className="space-y-3">
            <label htmlFor="targetRange" className="text-sm font-medium text-gray-700">
              Target Range (Optional)
            </label>
            <input
              type="text"
              id="targetRange"
              name="targetRange"
              value={inputs?.targetRange || ''}
              onChange={handleInput}
              placeholder={`e.g., 80-150 ${inputs?.measurementUnit === 'MMOL_L' ? 'mmol/L' : 'mg/dL'}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Set a custom target range as recommended by your veterinarian</p>
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Observed Symptoms</label>
            <div className="grid grid-cols-2 gap-2">
              {symptomsOptions.map((symptom: string) => {
                const isSelected =
                  inputs?.symptoms
                    ?.split(',')
                    .map((s: string) => s.trim())
                    .includes(symptom) || false
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => {
                      const currentSymptoms = inputs?.symptoms
                        ? inputs.symptoms.split(',').map((s: string) => s.trim())
                        : []
                      let newSymptoms

                      if (symptom === 'None observed') {
                        newSymptoms = isSelected ? [] : ['None observed']
                      } else {
                        if (isSelected) {
                          newSymptoms = currentSymptoms.filter((s: string) => s !== symptom && s !== 'None observed')
                        } else {
                          newSymptoms = [...currentSymptoms.filter((s: string) => s !== 'None observed'), symptom]
                        }
                      }

                      handleInput({ target: { name: 'symptoms', value: newSymptoms.join(', ') } })
                    }}
                    className={`p-2 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {symptom}
                  </button>
                )
              })}
            </div>
            {inputs?.symptoms && <p className="text-xs text-gray-600">Selected: {inputs.symptoms}</p>}
          </div>

          {/* Medication Given */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Medication Administration</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="medicationGiven"
                name="medicationGiven"
                checked={inputs?.medicationGiven || false}
                onChange={(e) => handleInput({ target: { name: 'medicationGiven', value: e.target.checked } })}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="medicationGiven" className="text-sm text-gray-700">
                Insulin or diabetes medication was given
              </label>
            </div>
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
        tokens={bloodSugarCreateTokenCost}
        text="Blood Sugar"
        close={close}
        func={() => isBloodSugarFormValid(inputs)}
      />
    </form>
  )
}

export default BloodSugarForm
