'use client'

import Spinner from '@/app/components/common/Spinner'
import { setPet } from '@/app/redux/features/petSlice'
import { useFetchAllPetsQuery } from '@/app/redux/services/petApi'
import { useAppDispatch } from '@/app/redux/store'
import { Pet } from '@/app/types/model.types'
import Link from 'next/link'
import React from 'react'

const PetList = () => {
  const { data, isLoading } = useFetchAllPetsQuery({}) as any
  const dispatch = useAppDispatch()

  return isLoading ? (
    <div className="w-full flex items-center justify-center">
      <Spinner fill="fill-white" track="text-indigo-500" />
    </div>
  ) : (
    <div className="flex flex-col gap-y-4">
      {data?.pets?.map((pet: Pet) => (
        <div key={pet.id} className="p-4 border-1 border-zinc-200 rounded-md flex items-center justify-between">
          <h1 className="text-sm font-semibold">
            {pet?.name} - <span className="font-normal">{pet?.breed}</span>
          </h1>
          <Link
            href={`/admin/pets/list/${pet.id}`}
            onClick={() => dispatch(setPet(pet))}
            className="text-sm shadow-md py-1 px-2 rounded-md active:shadow-none duration-200 active:translate-y-1 hover:bg-zinc-50"
          >
            Set Stats
          </Link>
        </div>
      ))}
    </div>
  )
}

export default PetList
