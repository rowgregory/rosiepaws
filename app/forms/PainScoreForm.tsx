'use client'

import { FC } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { PAIN_LEVELS } from '../lib/constants/public/pain'
import PetSelection from '../components/common/forms/PetSelection'
import FixedFooter from '../components/common/forms/FixedFooter'
import { painScoreCreateTokenCost, painScoreUpdateTokenCost } from '../lib/constants/public/token'
import { IForm } from '../types'
import Notes from '../components/common/forms/Notes'
import TimeRecorded from '../components/common/forms/TimeRecorded'
import { InputStyle } from '../lib/constants'
import { isPainScoreFormValid } from '../validations/validatePainScoreForm'

const PainScoreForm: FC<IForm> = ({ inputs, errors, handleInput, close, handleSubmit, loading, isUpdating }) => {
  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <PetSelection inputs={inputs} errors={errors} handleInput={handleInput} formName="painScoreForm" />

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

          {/* Symptoms */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Symptoms <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              name="symptoms"
              value={inputs.symptoms || ''}
              onChange={handleInput}
              placeholder="Describe any symptoms you observed (e.g., limping, panting, reluctance to move, whimpering)"
              rows={3}
              className={InputStyle}
            />
          </div>

          {/* Pain Location */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Pain Location <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="location"
              value={inputs.location || ''}
              onChange={handleInput}
              placeholder="Where is the pain located? (e.g., left hip, back legs, abdomen, neck)"
              className={InputStyle}
            />
          </div>

          {/* Pain Triggers */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Pain Triggers <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="triggers"
              value={inputs.triggers || ''}
              onChange={handleInput}
              placeholder="What triggered or worsened the pain? (e.g., after walking, weather change, before medication)"
              className={InputStyle}
            />
          </div>

          {/* Pain Relief */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Pain Relief <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="relief"
              value={inputs.relief || ''}
              onChange={handleInput}
              placeholder="What provided relief? (e.g., heat pad, medication, rest, massage)"
              className={InputStyle}
            />
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
        tokens={isUpdating ? painScoreUpdateTokenCost : painScoreCreateTokenCost}
        text="Pain Score"
        close={close}
        func={() => isPainScoreFormValid(inputs)}
        isUpdating={isUpdating}
      />
    </form>
  )
}

export default PainScoreForm
