import React, { FC, useMemo } from 'react'
import { Heart, PawPrint } from 'lucide-react'
import { IForm } from '../../types/common.types'
import { GENDER_OPTIONS, getCurrentBreeds, isPetFormValid, PET_TYPES } from './constants'

const PetForm: FC<IForm> = ({ inputs, errors, handleInput, close, handleSubmit, loading }) => {
  const isFormValid = useMemo(() => isPetFormValid(inputs), [inputs])

  return (
    <div onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
      <div className="space-y-6">
        {/* Pet Name */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <PawPrint className="w-4 h-4" />
            What&apos;s their name?
          </label>
          <input
            type="text"
            name="name"
            value={inputs?.name || ''}
            onChange={handleInput}
            placeholder="Enter your pet's name"
            className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
          {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Pet Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">What type of pet?</label>
          <div className="grid grid-cols-2 gap-3">
            {PET_TYPES.map((type) => (
              <label
                key={type.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all text-center hover:scale-105 ${
                  inputs?.type === type.id
                    ? `${type.color} border-current shadow-lg`
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <input type="radio" name="type" value={type.id} onChange={handleInput} className="hidden" />
                <div>
                  <span className="text-3xl mb-2 block">{type.icon}</span>
                  <p className="font-semibold">{type.name}</p>
                </div>
              </label>
            ))}
          </div>
          {errors?.type && <p className="text-sm text-red-500">{errors.type}</p>}
        </div>

        {/* Breed */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">What breed are they?</label>
          <div className="relative">
            <input
              type="text"
              name="breed"
              value={inputs?.breed || ''}
              onChange={handleInput}
              placeholder="Enter breed (e.g., Golden Retriever)"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              list="breeds"
            />
            <datalist id="breeds">
              {getCurrentBreeds(inputs).map((breed) => (
                <option key={breed} value={breed} />
              ))}
            </datalist>
          </div>
          {inputs?.type && (
            <div className="flex flex-wrap gap-2">
              {getCurrentBreeds(inputs)
                .slice(0, 4)
                .map((breed) => (
                  <button
                    key={breed}
                    type="button"
                    onClick={() => handleInput({ target: { name: 'breed', value: breed } })}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {breed}
                  </button>
                ))}
            </div>
          )}
          {errors?.breed && <p className="text-sm text-red-500">{errors.breed}</p>}
        </div>

        {/* Age */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">How old are they?</label>
          <div className="relative">
            <input
              type="text"
              name="age"
              value={inputs?.age || ''}
              onChange={handleInput}
              placeholder="e.g., 2 years, 6 months"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🎂</div>
          </div>
          {errors?.age && <p className="text-sm text-red-500">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            {GENDER_OPTIONS.map((gender) => (
              <label
                key={gender.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all text-center hover:scale-105 ${
                  inputs?.gender === gender.id
                    ? `${gender.color} border-current shadow-lg`
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <input type="radio" name="gender" value={gender.id} onChange={handleInput} className="hidden" />
                <div>
                  <span className="text-2xl mb-2 block">{gender.icon}</span>
                  <p className="font-semibold">{gender.name}</p>
                </div>
              </label>
            ))}
          </div>
          {errors?.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
        </div>

        {/* Weight */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Weight</label>
          <div className="relative">
            <input
              type="text"
              name="weight"
              value={inputs?.weight || ''}
              onChange={handleInput}
              placeholder="e.g., 45 lbs, 12 kg"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">⚖️</div>
          </div>
          {errors?.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Special notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="notes"
            value={inputs?.notes || ''}
            onChange={handleInput}
            placeholder="Any special information about your pet (personality, medical conditions, favorite treats, etc.)"
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          />
          {errors?.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
        </div>
      </div>
      {/* Fixed Footer */}
      <div className="sticky bottom-0 border-t border-zinc-200 bg-white pt-4 pb-5 flex justify-end gap-x-4 flex-shrink-0">
        <button
          type="button"
          onClick={close}
          className="text-sm px-4 py-2 rounded-xl font-medium flex items-center gap-x-2 border border-zinc-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-500 to-pink-500 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-x-2 min-w-[100px] hover:from-purple-600 hover:to-pink-600 transition-all disabled:hover:from-gray-300 disabled:hover:to-gray-400"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Heart className="w-4 h-4" />
              Add pet
            </>
          )}
        </button>
      </div>{' '}
    </div>
  )
}

export default PetForm
