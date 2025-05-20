'use client'

import AwesomeIcon from '@/app/components/common/AwesomeIcon'
import { pawIcon, plusIcon } from '@/app/lib/icons'
import { setOpenPetDrawer, setPet } from '@/app/redux/features/petSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import Link from 'next/link'
import React from 'react'

const GuardianPetsList = () => {
  const dispatch = useAppDispatch()
  const { zeroPets, pets } = useAppSelector((state: RootState) => state.pet)

  return (
    <>
      {zeroPets ? (
        <div className="mt-24">
          <div className="max-w-80 mx-auto w-full">
            <div className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-md">
              <AwesomeIcon icon={pawIcon} className="w-5 h-5 text-zinc-400" />
            </div>
            <h1 className="text-xl text-[#21252c] font-bold my-3">Start by adding a pet</h1>
            <button
              onClick={() => dispatch(setOpenPetDrawer())}
              className="bg-indigo-500 text-white text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1"
            >
              <AwesomeIcon icon={plusIcon} className="text-white w-3 h-3" />
              Add pet
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 flex flex-col gap-y-5">
          {pets?.map((pet) => (
            <div key={pet.id} className="p-4 border-1 border-zinc-200 rounded-md flex items-center justify-between">
              <h1 className="text-sm font-semibold">
                {pet?.name} - <span className="font-normal">{pet?.breed}</span>
              </h1>
              <Link
                href="/guardian/dashboard"
                onClick={() => dispatch(setPet(pet))}
                className="text-sm shadow-md py-1 px-2 rounded-md active:shadow-none duration-200 active:translate-y-1 hover:bg-zinc-50"
              >
                Set Dashboard
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default GuardianPetsList
