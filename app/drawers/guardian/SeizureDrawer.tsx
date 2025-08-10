import React, { useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { AlertTriangle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import SeizureForm from '@/app/forms/SeizureForm'
import { validateSeizureForm } from '@/app/validations/validateSeizureForm'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import GuardianSeizureGuide from '@/app/components/guardian/seizure/GuardianSeizureGuide'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { useCreateSeizureMutation, useUpdateSeizureMutation } from '@/app/redux/services/seizureApi'
import { setCloseSeizureDrawer } from '@/app/redux/features/seizureSlice'
import { seizureInitialState } from '@/app/lib/initial-states/seizure'
import { backdropVariants, drawerVariants } from '@/app/lib/constants'

const SeizureDrawer = () => {
  const dispatch = useAppDispatch()
  const { seizureDrawer } = useAppSelector((state: RootState) => state.seizure)
  const { seizureForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors, handleUploadProgress } = createFormActions('seizureForm', dispatch)
  const [updateSeizure, { isLoading: isUpdating }] = useUpdateSeizureMutation()
  const [createSeizure, { isLoading: isCreating }] = useCreateSeizureMutation()
  const [loading, setLoading] = useState(false)

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'seizureForm', data: { ...seizureInitialState, isUpdating: false } }))
  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseSeizureDrawer())
  }

  const isLoading = isUpdating || isCreating || loading
  const isUpdateMode = seizureForm?.inputs?.isUpdating

  const prepareSeizuretData = (videoUrl: string, videoFilename: string) => ({
    petId: seizureForm.inputs.petId,
    duration: Number(seizureForm.inputs.duration),
    timeRecorded: new Date(seizureForm.inputs.timeRecorded),
    notes: seizureForm.inputs.notes || '',
    videoUrl: videoUrl || '',
    videoFilename: videoFilename || '',
    seizureType: seizureForm.inputs.seizureType,
    severity: seizureForm.inputs.severity,
    triggerFactor: seizureForm.inputs.triggerFactor,
    recoveryTime: Number(seizureForm.inputs.recoveryTime)
  })

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateSeizureForm(seizureForm.inputs, setErrors)) return

    closeDrawer()

    try {
      setLoading(true)
      let videoUrl = ''
      let videoFilename = ''

      if (seizureForm.inputs.videoFile) {
        try {
          // Upload video to Firebase with progress tracking
          videoUrl = await uploadFileToFirebase(seizureForm.inputs.videoFile, handleUploadProgress, 'video')
          videoFilename = seizureForm.inputs.videoFile.name
        } catch {
          throw new Error('Failed to upload video. Please try again.')
        }
      }
      const seizureData = prepareSeizuretData(videoUrl, videoFilename)

      if (isUpdateMode) {
        await updateSeizure({
          seizureId: seizureForm.inputs.id,
          ...seizureData
        }).unwrap()
      } else {
        await createSeizure(seizureData).unwrap()
      }
    } catch {
    } finally {
      setLoading(false)
      resetInputs()
    }
  }

  return (
    <AnimatePresence>
      {seizureDrawer && (
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
            className="min-h-dvh w-full max-w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            <AnimatedDrawerHeader
              title={isUpdateMode ? 'Edit Seizure' : 'Add Seizure'}
              subtitle="Track your pet's appointments"
              Icon={AlertTriangle}
              closeDrawer={closeDrawer}
              color="text-yellow-500"
              iconGradient="from-yellow-500 to-orange-500"
            />
            <div className="flex flex-col lg:flex-row">
              <SeizureForm
                inputs={seizureForm.inputs}
                errors={seizureForm.errors}
                handleInput={handleInput}
                close={closeDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={isUpdateMode}
              />
              <GuardianSeizureGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SeizureDrawer
