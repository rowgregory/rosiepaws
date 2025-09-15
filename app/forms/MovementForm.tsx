import { FC } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { IForm } from '../types'
import {
  ACTIVITY_LEVELS,
  ASSISTANCE_TYPES,
  CheckboxStyle,
  ENERGY_LEVELS,
  GAIT_QUALITIES,
  InputStyle,
  MOBILITY_LEVELS,
  MOVEMENT_TYPES,
  PANTING_LEVELS
} from '../lib/constants'
import PetSelection from '../components/common/forms/PetSelection'
import FixedFooter from '../components/common/forms/FixedFooter'
import { movementCreateTokenCost, movementUpdateTokenCost } from '../lib/constants/public/token'
import TimeRecorded from '../components/common/forms/TimeRecorded'
import Notes from '../components/common/forms/Notes'
import { isMovementFormValid } from '../validations/validateMovementForm'

const MovementForm: FC<IForm> = ({
  inputs,
  errors,
  handleInput,
  close,
  handleSubmit,
  loading,
  handleToggle,
  isUpdating
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <PetSelection inputs={inputs} errors={errors} handleInput={handleInput} formName="movementForm" />

          {/* Movement Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Movement Type</label>
            <div className="grid grid-cols-1 gap-3">
              {MOVEMENT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                    inputs?.movementType === type.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : errors?.movementType
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="movementType"
                    value={type.value || ''}
                    onChange={handleInput}
                    className="hidden"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xl">
                        {type.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    {inputs?.movementType === type.value && (
                      <CheckCircle2 className="text-indigo-500 ml-auto" size={20} />
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors?.movementType && <p className="text-red-500 text-sm mt-1">{errors?.movementType}</p>}
          </div>

          {/* Duration and Distance */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Duration (minutes) <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="durationMinutes"
                value={inputs?.durationMinutes || 0}
                onChange={handleInput}
                placeholder="0"
                min="0"
                className={InputStyle}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Distance (meters)<span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="distanceMeters"
                value={inputs?.distanceMeters || 0}
                onChange={handleInput}
                placeholder="0"
                min="0"
                step="0.1"
                className={InputStyle}
              />
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Activity Level</label>
            <div className="grid grid-cols-1 gap-2">
              {ACTIVITY_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-left ${
                    inputs?.activityLevel === level.value
                      ? `${level.borderColor} ${level.bgColor}`
                      : errors?.activityLevel
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value || ''}
                    onChange={handleInput}
                    className="hidden"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${level.color} rounded-full`}></div>
                      <span className="font-medium text-gray-900">{level.label}</span>
                    </div>
                    {inputs?.activityLevel === level.value && (
                      <CheckCircle2 className="text-current ml-auto" size={16} />
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors?.activityLevel && <p className="text-red-500 text-sm mt-1">{errors?.activityLevel}</p>}
          </div>

          {/* Location and Environment */}
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Location <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="location"
                value={inputs?.location || ''}
                onChange={handleInput}
                placeholder="e.g., Park, Backyard, Living Room"
                className={InputStyle}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="indoor"
                checked={inputs?.indoor || false}
                onChange={handleToggle}
                className={CheckboxStyle}
              />
              <label className="text-sm text-gray-700">Indoor activity</label>
            </div>
          </div>

          {/* Energy Levels */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Energy Before</label>
              <select
                name="energyBefore"
                value={inputs?.energyBefore || ''}
                onChange={handleInput}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors?.energyBefore ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select energy level...</option>
                {ENERGY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors?.energyBefore && <p className="text-red-500 text-sm mt-1">{errors?.energyBefore}</p>}
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Energy After</label>
              <select
                name="energyAfter"
                value={inputs?.energyAfter || ''}
                onChange={handleInput}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors?.energyAfter ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select energy level...</option>
                {ENERGY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors?.energyAfter && <p className="text-red-500 text-sm mt-1">{errors?.energyAfter}</p>}
            </div>
          </div>

          {/* Pain Levels */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Pain Before (0-10) <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="painBefore"
                value={inputs?.painBefore || 0}
                onChange={handleInput}
                placeholder="0"
                min="0"
                max="10"
                className={InputStyle}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Pain After (0-10) <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="painAfter"
                value={inputs?.painAfter || 0}
                onChange={handleInput}
                placeholder="0"
                min="0"
                max="10"
                className={InputStyle}
              />
            </div>
          </div>

          {/* Gait Quality */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Gait Quality <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {GAIT_QUALITIES.map((gait) => (
                <label
                  key={gait.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                    inputs?.gaitQuality === gait.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : errors?.gaitQuality
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input type="radio" name="gaitQuality" value={gait.value} onChange={handleInput} className="hidden" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{gait.label}</p>
                      <p className="text-sm text-gray-600">{gait.description}</p>
                    </div>
                    {inputs?.gaitQuality === gait.value && (
                      <CheckCircle2 className="text-indigo-500 ml-auto" size={16} />
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors?.gaitQuality && <p className="text-red-500 text-sm mt-1">{errors?.gaitQuality}</p>}
          </div>

          {/* Mobility and Assistance */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Mobility Level</label>
              <select
                name="mobility"
                value={inputs?.mobility || ''}
                onChange={handleInput}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors?.mobility ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select mobility...</option>
                {MOBILITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors?.mobility && <p className="text-red-500 text-sm mt-1">{errors?.mobility}</p>}
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Assistance Type <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <select name="assistance" value={inputs?.assistance || ''} onChange={handleInput} className={InputStyle}>
                <option value="">Select assistance...</option>
                {ASSISTANCE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Equipment Used */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Equipment Used</label>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="wheelchair"
                  checked={inputs?.wheelchair || false}
                  onChange={handleToggle}
                  className={CheckboxStyle}
                />
                <label className="text-sm text-gray-700">Wheelchair</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="harness"
                  checked={inputs?.harness || false}
                  onChange={handleToggle}
                  className={CheckboxStyle}
                />
                <label className="text-sm text-gray-700">Harness</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="leash"
                  checked={inputs?.leash || false}
                  onChange={handleToggle}
                  className={CheckboxStyle}
                />
                <label className="text-sm text-gray-700">Leash</label>
              </div>
            </div>
          </div>

          {/* Behavioral Observations */}
          <div className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Enthusiasm (1-10) <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  name="enthusiasm"
                  value={inputs?.enthusiasm || 0}
                  onChange={handleInput}
                  placeholder="5"
                  className={InputStyle}
                  min="0"
                  max="10"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Panting Level <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <select name="panting" value={inputs?.panting || ''} onChange={handleInput} className={InputStyle}>
                  <option value="">Select panting level...</option>
                  {PANTING_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="reluctance"
                  checked={inputs?.reluctance || false}
                  onChange={handleToggle}
                  className={CheckboxStyle}
                />
                <label className="text-sm text-gray-700">Showed reluctance</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="limping"
                  checked={inputs?.limping || false}
                  onChange={handleToggle}
                  className={CheckboxStyle}
                />
                <label className="text-sm text-gray-700">Limping observed</label>
              </div>
            </div>
          </div>

          {/* Rest and Recovery */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Rest Breaks <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="restBreaks"
                value={inputs?.restBreaks || 0}
                onChange={handleInput}
                placeholder="0"
                min="0"
                className={InputStyle}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Recovery Time (min) <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="recoveryTime"
                value={inputs?.recoveryTime || 0}
                onChange={handleInput}
                placeholder="0"
                min="0"
                className={InputStyle}
              />
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
        tokens={isUpdating ? movementUpdateTokenCost : movementCreateTokenCost}
        text="Movement"
        close={close}
        func={() => isMovementFormValid(inputs)}
        isUpdating={isUpdating}
      />
    </form>
  )
}

export default MovementForm
