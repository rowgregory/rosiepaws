import { formatForDateTimeLocal } from '@/app/lib/utils'
import React, { FC, useState } from 'react'

const getQuickTimes = () => [
  { label: 'Just now', value: new Date().toISOString() },
  { label: '1 hour ago', value: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { label: '2 hours ago', value: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { label: '3 hours ago', value: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
]

const TimeRecorded: FC<{ inputs: any; handleInput: any; errors: any }> = ({ inputs, handleInput, errors }) => {
  const QUICK_TIMES = getQuickTimes()

  const [selectedQuickTimeLabel, setSelectedQuickTimeLabel] = useState<string | null>(null)

  const handleQuickTimeClick = (time: any) => {
    setSelectedQuickTimeLabel(time.label) // Remember which button was clicked
    handleInput({ target: { name: 'timeRecorded', value: time.value } })
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Time Recorded</label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {QUICK_TIMES.map((time, index) => (
          <label
            key={index}
            className={`p-2 rounded-lg border cursor-pointer text-sm transition-all text-center ${
              selectedQuickTimeLabel === time.label
                ? 'border-indigo-500 bg-indigo-50'
                : errors?.timeRecorded
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-indigo-300'
            }`}
          >
            <input
              type="radio"
              name="timeRecorded"
              value={time.value}
              checked={selectedQuickTimeLabel === time.label} // Check by label instead
              onChange={() => handleQuickTimeClick(time)}
              className="hidden"
            />
            {time.label}
          </label>
        ))}
      </div>

      <input
        type="datetime-local"
        name="timeRecorded"
        value={formatForDateTimeLocal(inputs?.timeRecorded) || ''}
        onChange={handleInput}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          errors?.timeRecorded ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors?.timeRecorded && <p className="text-red-500 text-sm mt-1">{errors?.timeRecorded}</p>}
    </div>
  )
}

export default TimeRecorded
