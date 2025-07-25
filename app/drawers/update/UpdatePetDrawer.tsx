'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setClosePetUpdateDrawer } from '@/app/redux/features/petSlice'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { validatePetForm } from '@/app/validations/validatePetForm'
import { useUpdatePetMutation } from '@/app/redux/services/petApi'
import PetForm from '@/app/forms/PetForm'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GuardianPetGuide from '@/app/components/guardian/GuardianPetGuide'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'

const UpdatePetDrawer = () => {
  const { petUpdateDrawer } = useAppSelector((state: RootState) => state.pet)
  const { petForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('petForm', dispatch)
  const closePetDrawer = () => dispatch(setClosePetUpdateDrawer())
  const [updatePet, { isLoading }] = useUpdatePetMutation()

  const handleAddPet = async (e: MouseEvent) => {
    e.preventDefault()

    if (!validatePetForm(petForm.inputs, setErrors)) return

    try {
      await updatePet({
        id: petForm.inputs.id,
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
      }).unwrap()

      closePetDrawer()
      dispatch(clearInputs({ formName: 'petForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {petUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
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
              title="Update Your Pet"
              subtitle="Let's update your furry friend!"
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
                isUpdating
              />
              <GuardianPetGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdatePetDrawer
