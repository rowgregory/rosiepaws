import { QUICK_TIMES } from '@/app/lib/utils'
import React, { FC } from 'react'

const TimeRecorded: FC<{ inputs: any; handleInput: any; errors: any }> = ({ inputs, handleInput, errors }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Time Recorded</label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {QUICK_TIMES.map((time, index) => (
          <label
            key={index}
            className={`p-2 rounded-lg border cursor-pointer text-sm transition-all text-center ${
              inputs?.timeRecorded === time.value
                ? 'border-indigo-500 bg-indigo-50'
                : errors?.timeRecorded
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-indigo-300'
            }`}
          >
            <input type="radio" name="timeRecorded" value={time.value} onChange={handleInput} className="hidden" />
            {time.label}
          </label>
        ))}
      </div>

      <input
        type="datetime-local"
        name="timeRecorded"
        value={inputs?.timeRecorded || ''}
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
