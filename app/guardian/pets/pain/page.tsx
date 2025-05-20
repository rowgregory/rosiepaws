'use client'

import AwesomeIcon from '@/app/components/common/AwesomeIcon'
import { heartBeatIcon, plusIcon } from '@/app/lib/icons'
import { setOpenPainScoreDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { PainScore } from '@/app/types/model.types'
import { formatDate } from '@/app/utils/date.functions'
import React from 'react'

const PainScoring = () => {
  const dispatch = useAppDispatch()
  const { zeroPainScores, painScores } = useAppSelector((state: RootState) => state.pet)

  return (
    <>
      {zeroPainScores ? (
        <div className="mt-24">
          <div className="max-w-80 mx-auto w-full">
            <div className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-md">
              <AwesomeIcon icon={heartBeatIcon} className="w-5 h-5 text-zinc-400" />
            </div>
            <h1 className="text-xl text-[#21252c] font-bold my-3">Start by adding a pain score</h1>
            <button
              onClick={() => dispatch(setOpenPainScoreDrawer())}
              className="bg-indigo-500 text-white text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1"
            >
              <AwesomeIcon icon={plusIcon} className="text-white w-3 h-3" />
              Add pain score
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 flex flex-col gap-y-5">
          {painScores?.map((painScore: PainScore) => (
            <div
              key={painScore.id}
              className="p-4 border-1 border-zinc-200 rounded-md flex items-center justify-between"
            >
              <h1 className="text-sm">
                {painScore?.pet?.name} -{' '}
                <span
                  className={`${
                    painScore?.score === 0
                      ? 'text-blue-500'
                      : painScore?.score === 1
                      ? 'text-green-500'
                      : painScore?.score === 2
                      ? 'text-yellow-500'
                      : painScore?.score === 3
                      ? 'text-orange-500'
                      : 'text-red-500'
                  } font-bold`}
                >
                  {painScore?.score}
                </span>
              </h1>
              <h2 className="text-sm font-semibold">
                {formatDate(painScore?.createdAt, { second: 'numeric', minute: 'numeric', hour: 'numeric' })}
              </h2>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default PainScoring
