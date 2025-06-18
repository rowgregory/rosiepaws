'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setClosePetDrawer } from '../redux/features/petSlice'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { validatePetForm } from '../validations/validatePetForm'
import { useCreatePetMutation } from '../redux/services/petApi'
import PetForm from '../forms/pet-form/PetForm'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GuardianPetGuide from '../components/guardian/GuardianPetGuide'
import AnimatedDrawerHeader from '../components/guardian/AnimatedDrawerHeader'

const CreatePetDrawer = () => {
  const { petDrawer } = useAppSelector((state: RootState) => state.pet)
  const { petForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('petForm', dispatch)
  const closePetDrawer = () => dispatch(setClosePetDrawer())
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

      closePetDrawer()
      dispatch(clearInputs({ formName: 'petForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {petDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closePetDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            {/* Header */}
            <AnimatedDrawerHeader
              title="Add Your Pet"
              subtitle="Let's get to know your furry friend!"
              Icon={Heart}
              closeDrawer={closePetDrawer}
              color="text-pink-500"
              iconGradient="from-purple-500 to-pink-500"
            />

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              <PetForm
                inputs={petForm.inputs}
                errors={petForm.errors}
                handleInput={handleInput}
                close={closePetDrawer}
                handleSubmit={handleAddPet}
                loading={isLoading}
              />
              <GuardianPetGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreatePetDrawer
