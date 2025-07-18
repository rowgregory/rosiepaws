'use client'

import { setInputs } from '@/app/redux/features/formSlice'
import { ChangeEvent, useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { Bell, Pill, Plus, Search, X } from 'lucide-react'
import { COMMON_MEDICATIONS, DOSAGE_UNITS, FREQUENCIES, TIME_ZONE_OPTIONS } from '../lib/constants'
import { getDefaultReminderTimes, isMedicationFormValid } from '../lib/utils'
import PetSelection from '../components/common/forms/PetSelection'
import FixedFooter from '../components/common/forms/FixedFooter'
import { medicationCreateTokenCost } from '../lib/constants/token'
import Notes from '../components/common/forms/Notes'

const MedicationForm = ({ inputs, handleSubmit, close, errors, loading, isUpdating }: any) => {
  const [drugSearchResults, setDrugSearchResults] = useState<string[]>([])
  const [showDrugSearch, setShowDrugSearch] = useState(false)
  const dispatch = useAppDispatch()
  const { pets } = useAppSelector((state: RootState) => state.pet)
  const { medicationForm } = useAppSelector((state: RootState) => state.form)

  const handleDrugSearch = (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const results = COMMON_MEDICATIONS.filter((drug) => drug.toLowerCase().includes(searchTerm.toLowerCase()))
      setDrugSearchResults(results)
      setShowDrugSearch(true)
    } else {
      setShowDrugSearch(false)
    }
  }

  const selectDrug = (drugName: string) => {
    dispatch(setInputs({ formName: 'medicationForm', data: { drugName } }))
    setShowDrugSearch(false)
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      dispatch(
        setInputs({
          formName: 'medicationForm',
          data: {
            [name]: checked,
            // Auto-populate reminder times when enabled
            ...(name === 'reminderEnabled' &&
              checked &&
              medicationForm?.inputs?.reminderTimes?.length === 0 && {
                reminderTimes: getDefaultReminderTimes(medicationForm?.inputs?.frequency)
              })
          }
        })
      )
    } else {
      dispatch(
        setInputs({
          formName: 'medicationForm',
          data: {
            [name]: value,
            // Reset drug name when switching input types
            ...(name === 'drugInputType' && { drugName: '' }),
            // Update reminder times when frequency changes
            ...(name === 'frequency' &&
              medicationForm?.inputs?.reminderEnabled && {
                reminderTimes: getDefaultReminderTimes(value)
              })
          }
        })
      )
    }
  }

  const addReminderTime = () => {
    const newTime = '08:00'
    const currentReminderTimes = medicationForm?.inputs?.reminderTimes || []

    dispatch(
      setInputs({
        formName: 'medicationForm',
        data: {
          reminderTimes: [...currentReminderTimes, newTime]
        }
      })
    )
  }

  const updateReminderTime = (index: number, time: string) => {
    dispatch(
      setInputs({
        formName: 'medicationForm',
        data: {
          reminderTimes: medicationForm?.inputs?.reminderTimes.map((t: any, i: number) => (i === index ? time : t))
        }
      })
    )
  }

  const removeReminderTime = (index: number) => {
    dispatch(
      setInputs({
        formName: 'medicationForm',
        data: {
          reminderTimes: medicationForm?.inputs?.reminderTimes.filter((_: any, i: number) => i !== index)
        }
      })
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto bg-white min-h-screen">
      <div className="flex-1 flex flex-col min-h-full">
        <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
          <div className="space-y-6">
            {/* Pet Selection */}
            <PetSelection
              pets={pets}
              handleInput={handleInput}
              inputs={inputs}
              errors={errors}
              formName="medicationForm"
            />

            {/* Drug Input Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Medication Entry</label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    medicationForm?.inputs?.drugInputType === 'search'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <input type="radio" name="drugInputType" value="search" onChange={handleInput} className="hidden" />
                  <Search className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-xs font-medium">Search Database</p>
                </label>
                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    medicationForm?.inputs?.drugInputType === 'manual'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <input type="radio" name="drugInputType" value="manual" onChange={handleInput} className="hidden" />
                  <Pill className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-xs font-medium">Manual Entry</p>
                </label>
              </div>
            </div>

            {/* Drug Name Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Medication Name</label>
              {medicationForm?.inputs?.drugInputType === 'search' ? (
                <div className="relative">
                  <input
                    type="text"
                    name="drugName"
                    value={medicationForm?.inputs?.drugName || ''}
                    onChange={(e) => {
                      handleInput(e)
                      handleDrugSearch(e.target.value)
                    }}
                    placeholder="Search for medication..."
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors?.drugName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />

                  {/* Search Results */}
                  {showDrugSearch && drugSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {drugSearchResults.map((drug) => (
                        <button
                          key={drug}
                          type="button"
                          onClick={() => selectDrug(drug)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors"
                        >
                          {drug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  name="drugName"
                  value={inputs?.drugName || ''}
                  onChange={handleInput}
                  placeholder="Enter medication name..."
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.drugName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              )}
              {errors?.drugName && <p className="text-red-500 text-sm mt-1">{errors?.drugName}</p>}
            </div>

            {/* Dosage */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Dosage</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="dosage"
                  value={medicationForm?.inputs?.dosage || 0}
                  onChange={handleInput}
                  placeholder="Amount"
                  step="0.1"
                  min="0"
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.dosage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <select
                  name="dosageUnit"
                  value={medicationForm?.inputs?.dosageUnit || ''}
                  onChange={handleInput}
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.dosageUnit ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Unit</option>
                  {DOSAGE_UNITS.map((unit) => (
                    <option key={unit} value={unit || ''}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              {(errors?.dosage || errors?.dosageUnit) && (
                <p className="text-red-500 text-sm mt-1">{errors?.dosage || errors?.dosageUnit}</p>
              )}
            </div>

            {/* Frequency */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Frequency</label>
              <select
                name="frequency"
                value={medicationForm?.inputs?.frequency || ''}
                onChange={handleInput}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.frequency ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select frequency</option>
                {FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={
                    medicationForm?.inputs?.startDate
                      ? new Date(medicationForm?.inputs?.startDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleInput}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors?.startDate && <p className="text-red-500 text-sm mt-1">{errors?.startDate}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">End Date (Optional)</label>
                <input
                  type="date"
                  name="endDate"
                  value={medicationForm?.inputs?.endDate || ''}
                  onChange={handleInput}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Reminder Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="reminderEnabled"
                  checked={medicationForm?.inputs?.reminderEnabled || false}
                  onChange={handleInput}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Bell className="w-4 h-4 mr-1" />
                  Enable medication reminders
                </label>
              </div>

              {medicationForm?.inputs?.reminderEnabled && (
                <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div>
                    <label>Timezone:</label>
                    <select
                      value={medicationForm?.inputs?.timezoneOffset || ''}
                      onChange={handleInput}
                      name="timezoneOffset"
                    >
                      {TIME_ZONE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value || 0}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-blue-700">Reminder Times</label>
                    <button
                      type="button"
                      onClick={addReminderTime}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Time
                    </button>
                  </div>

                  <div className="space-y-2">
                    {medicationForm?.inputs?.reminderTimes?.map((time: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={time || ''}
                          onChange={(e) => updateReminderTime(index, e.target.value)}
                          className="flex-1 p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <X onClick={() => removeReminderTime(index)} className="text-red-600 hover:text-red-700 p-2" />
                      </div>
                    ))}
                  </div>
                  {medicationForm?.errors?.reminderTimes && (
                    <p className="text-red-500 text-sm mt-1">{errors?.reminderTimes}</p>
                  )}
                </div>
              )}
            </div>

            {/* Additional Fields */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Prescribed By (Optional)</label>
              <input
                type="text"
                name="prescribedBy"
                value={medicationForm?.inputs?.prescribedBy || ''}
                onChange={handleInput}
                placeholder="Veterinarian name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Notes */}
            <Notes inputs={inputs} handleInput={handleInput} />
          </div>
        </div>

        {/* Fixed Footer */}
        <FixedFooter
          inputs={inputs}
          loading={loading}
          tokens={medicationCreateTokenCost}
          text="Medication"
          close={close}
          func={() => isMedicationFormValid(inputs)}
          isUpdating={isUpdating}
        />
      </div>
    </form>
  )
}

export default MedicationForm
