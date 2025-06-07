'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setClosePetDrawer } from '../redux/features/petSlice'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { validatePetForm } from '../validations/validatePetForm'
import { useCreatePetMutation } from '../redux/services/petApi'
import PetForm from '../forms/pet-form/PetForm'
import { Heart, Sparkles } from 'lucide-react'

const CreatePetDrawer = () => {
  const { petDrawer } = useAppSelector((state: RootState) => state.pet)
  const { petForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('petForm', dispatch)
  const closeDrawer = () => dispatch(setClosePetDrawer())
  const [createPet, { isLoading }] = useCreatePetMutation()

  const handleAddPet = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validatePetForm(petForm.inputs, setErrors)
    if (!isValid) return

    try {
      await createPet({
        name: petForm.inputs.name,
        type: petForm.inputs.type.toUpperCase(),
        breed: petForm.inputs.breed,
        age: petForm.inputs.age,
        gender: petForm.inputs.gender,
        weight: petForm.inputs.weight,
        notes: petForm.inputs.notes
      }).unwrap()
      closeDrawer()
      dispatch(clearInputs({ formName: 'petForm' }))
    } catch {}
  }

  return (
    <div
      className={`${
        petDrawer ? 'translate-x-0' : 'translate-x-full'
      } duration-500 min-h-dvh w-[500px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col`}
    >
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Your Pet</h2>
              <p className="text-sm text-gray-500">Let&apos;s get to know your furry friend!</p>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
      </div>
      <div className="overflow-y-scroll short:h-[calc(100dvh-132px)] px-5">
        <PetForm
          inputs={petForm.inputs}
          errors={petForm.errors}
          handleInput={handleInput}
          close={closeDrawer}
          handleSubmit={handleAddPet}
          loading={isLoading}
        />
      </div>
    </div>
  )
}

export default CreatePetDrawer
