'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setClosePetDrawer } from '@/app/redux/features/petSlice'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { validatePetForm } from '@/app/validations/validatePetForm'
import { useCreatePetMutation, useUpdatePetMutation } from '@/app/redux/services/petApi'
import PetForm from '@/app/forms/PetForm'
import { Heart } from 'lucide-react'
import GuardianPetGuide from '@/app/components/guardian/form-guides/PetGuide'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { setOpenFirstPetModal, setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { deleteFileFromFirebase, uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'
import SlideMessage from '@/app/components/auth/SlideMessage'

const getFormattedAge = (inputs: { ageYears: string; ageMonths: string }) => {
  const years = inputs.ageYears ? `${inputs.ageYears} ${inputs.ageYears === '1' ? 'year' : 'years'}` : ''
  const months = inputs.ageMonths ? `${inputs.ageMonths} ${inputs.ageMonths === '1' ? 'month' : 'months'}` : ''

  if (years && months) return `${years}, ${months}`
  if (years) return years
  if (months) return months
  return ''
}

const PetDrawer = () => {
  const { petDrawer } = useAppSelector((state: RootState) => state.pet)
  const { petForm } = useAppSelector((state: RootState) => state.form)
  const { user } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors, handleUploadProgress } = createFormActions('petForm', dispatch)
  const [createPet, { isLoading: isCreating, error: errorCreate }] = useCreatePetMutation() as any
  const [updatePet, { isLoading: isUpdating, error: errorUpdate }] = useUpdatePetMutation() as any
  const [submitting, setSubmitting] = useState(false)
  const closeDrawer = () => dispatch(setClosePetDrawer())

  const isLoading = isUpdating || isCreating || submitting
  const isUpdateMode = petForm?.inputs?.isUpdating
  const error = errorCreate?.data?.message || errorUpdate?.data?.message

  const preparePetData = () => ({
    name: petForm.inputs.name,
    type: petForm.inputs.type.toUpperCase(),
    breed: petForm.inputs.breed,
    age: getFormattedAge(petForm.inputs),
    gender: petForm.inputs.gender,
    weight: String(petForm.inputs.weight),
    notes: petForm.inputs.notes,
    spayedNeutered: petForm.inputs.spayedNeutered,
    microchipId: petForm.inputs.microchipId,
    allergies: petForm.inputs.allergies,
    emergencyContactName: petForm.inputs.emergencyContactName,
    emergencyContactPhone: petForm.inputs.emergencyContactPhone
  })

  const getTypeFromFile = (fileName: string): 'image' | 'video' => {
    const extension = fileName?.toLowerCase()?.split?.('.')?.pop()
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'quicktime']
    return videoExtensions.includes(extension || '') ? 'video' : 'image'
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validatePetForm(petForm.inputs, setErrors)) return

    try {
      setSubmitting(true)

      const petData = preparePetData()

      let mediaUrl = null
      if (isUpdateMode) {
        const fileToDelete = petForm.inputs.fileName

        const fileType = getTypeFromFile(fileToDelete)

        if (petForm.inputs.wantsToRemove) {
          await deleteFileFromFirebase(fileToDelete, fileType)
        }
        if (petForm.inputs.wantsToReplace) {
          if (petForm.inputs.shouldDeleteOriginal) {
            await deleteFileFromFirebase(fileToDelete, fileType)
          }

          mediaUrl = await uploadFileToFirebase(
            petForm.inputs.media,
            handleUploadProgress,
            getTypeFromFile(petForm.inputs.media.name)
          )
        }
      } else if (petForm.inputs.media) {
        mediaUrl = await uploadFileToFirebase(
          petForm.inputs.media,
          handleUploadProgress,
          getTypeFromFile(petForm.inputs.media.name)
        )
      }

      const finalPetData = {
        ...petData,
        ...(mediaUrl && { filePath: mediaUrl, fileName: petForm.inputs.media.name }),
        ...(petForm.inputs.wantsToRemove && { filePath: null, fileName: null })
      }

      if (user?.pets?.length === 0) {
        dispatch(setOpenFirstPetModal(finalPetData.name))
      }

      if (isUpdateMode) {
        await updatePet({
          petId: petForm.inputs.id,
          ...finalPetData
        }).unwrap()
      } else {
        await createPet(finalPetData).unwrap()
      }

      dispatch(clearInputs({ formName: 'petForm' }))
    } catch {
      dispatch(setOpenSlideMessage())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SlideMessage message={error} type="Error" />
      <AnimatePresence>
        {petDrawer && (
          <>
            <Backdrop close={closeDrawer} />
            <Drawer>
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
            </Drawer>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default PetDrawer
