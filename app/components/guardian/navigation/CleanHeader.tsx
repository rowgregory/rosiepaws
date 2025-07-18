import { useAppDispatch } from '@/app/redux/store'
import React, { FC } from 'react'
import TokenCounter from '../TokenCounter'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'

interface ICleanHeader {
  func: ActionCreatorWithoutPayload | null
  tokens: number
  btnText: string
}

const CleanHeader: FC<ICleanHeader> = ({ func, tokens, btnText }) => {
  const dispatch = useAppDispatch()

  return (
    <div className="flex items-center pt-4">
      <button
        onClick={() => (func ? dispatch(func()) : {})}
        className="inline-flex items-center gap-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200"
      >
        {btnText}
        <TokenCounter tokens={tokens} />
      </button>
    </div>
  )
}

export default CleanHeader
