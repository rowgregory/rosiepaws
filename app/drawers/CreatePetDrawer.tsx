'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import AwesomeIcon from '../components/common/AwesomeIcon'
import { timesIcon } from '../lib/icons'
import { setClosePetDrawer } from '../redux/features/petSlice'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { validatePetForm } from '../validations/validatePetForm'
import { useCreatePetMutation } from '../redux/services/petApi'
import PetForm from '../forms/PetForm'

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
      <AwesomeIcon
        onClick={() => closeDrawer()}
        icon={timesIcon}
        className="w-4 h-4 hover:text-indigo-500 duration-300 absolute top-5 right-5 cursor-pointer"
      />
      <h1 className="text-xl px-5 pt-4 text-[#21252c] font-bold pb-5 border-b border-zinc-150">Add Pet</h1>
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
