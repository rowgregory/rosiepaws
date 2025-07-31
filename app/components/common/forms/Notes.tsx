import React, { FC } from 'react'

const Notes: FC<{ inputs: any; handleInput: any }> = ({ inputs, handleInput }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Additional Notes <span className="text-gray-500 font-normal">(optional)</span>
      </label>
      <textarea
        name="notes"
        value={inputs?.notes || ''}
        onChange={handleInput}
        placeholder="Any additional observations about the session..."
        rows={3}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none border-gray-300`}
      />
    </div>
  )
}

export default Notes
