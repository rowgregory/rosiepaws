'use client'

import React, { FC, useMemo } from 'react'
import Select from '../components/admin/form-elements/Select'
import Spinner from '../components/common/Spinner'
import { isPainScoreFormValid } from '../validations/validatePainScoreForm'
import { RootState, useAppSelector } from '../redux/store'
import AwesomeIcon from '../components/common/AwesomeIcon'
import { checkIcon } from '../lib/icons'

interface PainScoreFormProps {
  inputs: any
  errors: any
  handleInput: any
  close: any
  handleSubmit: any
  loading: boolean
}

const PainScoreForm: FC<PainScoreFormProps> = ({ inputs, errors, handleInput, close, handleSubmit, loading }) => {
  const isFormValid = useMemo(() => isPainScoreFormValid(inputs), [inputs])
  const { pets } = useAppSelector((state: RootState) => state.pet)

  return (
    <form onSubmit={handleSubmit} id="painScoreForm" className="flex-1 flex flex-col gap-y-4 pt-9 pb-24 px-5 h-fit">
      <Select
        name="petId"
        handleInput={handleInput}
        value={inputs?.petId || ''}
        list={['Select pet', ...(pets || [])]}
        error={errors?.petId}
        label="Pet"
      />
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">Pain Score</label>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((num) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-orange-500', 'bg-red-500']

            const selected = inputs?.score === num

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleInput({ target: { name: 'score', value: num } })}
                className={`relative w-12 h-12 flex items-center justify-center font-semibold text-lg rounded-md text-white shadow-sm transition-all duration-200 ${colors[num]} opacity-80 hover:opacity-100`}
              >
                {num}{' '}
                {selected && <AwesomeIcon icon={checkIcon} className="w-3 h-3 top-1 right-1 text-white absolute" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-1/2 border-t border-zinc-200 pt-4 px-5 pb-5 flex justify-end gap-x-4">
        <button
          type="button"
          onClick={() => close()}
          className="text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1 border border-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="bg-indigo-500 disabled:bg-[#b7b2ff] text-white text-sm px-2 py-1 rounded-md font-medium flex items-center justify-center gap-x-1 min-w-[67.8px]"
        >
          {loading ? <Spinner fill="fill-white" track="text-indigo-500" wAndH="w-4 h-4" /> : 'Add Score'}
        </button>
      </div>
    </form>
  )
}

export default PainScoreForm
