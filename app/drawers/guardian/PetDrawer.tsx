'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setClosePetDrawer } from '@/app/redux/features/petSlice'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { validatePetForm } from '@/app/validations/validatePetForm'
import { useCreatePetMutation, useUpdatePetMutation } from '@/app/redux/services/petApi'
import PetForm from '@/app/forms/PetForm'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GuardianPetGuide from '@/app/components/guardian/form-guides/PetGuide'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { backdropVariants, drawerVariants } from '@/app/lib/constants'

const PetDrawer = () => {
  const { petDrawer } = useAppSelector((state: RootState) => state.pet)
  const { petForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('petForm', dispatch)
  const [createPet, { isLoading: isCreating }] = useCreatePetMutation()
  const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation()

  const closeDrawer = () => dispatch(setClosePetDrawer())

  const isLoading = isUpdating || isCreating
  const isUpdateMode = petForm?.inputs?.isUpdating

  const preparePetData = () => ({
    name: petForm.inputs.name,
    type: petForm.inputs.type.toUpperCase(),
    breed: petForm.inputs.breed,
    age: petForm.inputs.age,
    gender: petForm.inputs.gender,
    weight: petForm.inputs.weight,
    notes: petForm.inputs.notes,
    spayedNeutered: petForm.inputs.spayedNeutered,
    microchipId: petForm.inputs.microchipId,
    allergies: petForm.inputs.allergies,
    emergencyContactName: petForm.inputs.emergencyContactName,
    emergencyContactPhone: petForm.inputs.emergencyContactPhone
  })

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault()

    closeDrawer()

    if (!validatePetForm(petForm.inputs, setErrors)) return

    try {
      const petData = preparePetData()

      if (isUpdateMode) {
        await updatePet({
          petId: petForm.inputs.id,
          ...petData
        }).unwrap()
      } else {
        await createPet(petData).unwrap()
      }

      dispatch(clearInputs({ formName: 'petForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {petDrawer && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeDrawer}
          />
          <motion.div
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            <AnimatedDrawerHeader
              title={isUpdateMode ? 'Edit Pet' : 'Add Pet'}
              subtitle="Let's get to know your furry friend!"
              Icon={Heart}
              closeDrawer={closeDrawer}
              color="text-pink-500"
              iconGradient="from-purple-500 to-pink-500"
            />

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              <PetForm
                inputs={petForm.inputs}
                errors={petForm.errors}
                handleInput={handleInput}
                close={closeDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={isUpdateMode}
              />
              <GuardianPetGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PetDrawer
