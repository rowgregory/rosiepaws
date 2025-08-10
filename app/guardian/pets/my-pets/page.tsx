'use client'

import { setOpenPetDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppSelector } from '@/app/redux/store'
import React from 'react'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import PetCard from '@/app/components/guardian/my-pets/PetCard'
import { Pet } from '@/app/types/entities'
import { petCreateTokenCost } from '@/app/lib/constants/public/token'

const MyPets = () => {
  const { zeroPets, pets } = useAppSelector((state: RootState) => state.pet)

  if (zeroPets) {
    return (
      <ZeroLogs
        btnText="Add first pet"
        title="No pets added yet"
        subtitle="Get started by adding your first pet to begin tracking their health and activities."
        tokens={petCreateTokenCost}
        func={setOpenPetDrawer}
        formName="petForm"
      />
    )
  }

  return (
    <div className="h-[calc(100dvh-96px)]">
      <div className="mx-auto px-6 space-y-8">
        {/* Header */}
        <CleanHeader btnText="Add Pet" func={setOpenPetDrawer} tokens={petCreateTokenCost} formName="petForm" />

        {/* Pet Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet: Pet, index: number) => (
            <PetCard key={pet.id} pet={pet} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyPets
