import React, { useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { setCloseSeizureDrawer } from '../redux/features/petSlice'
import { AlertTriangle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import SeizureForm from '../forms/SeizureForm'
import { validateSeizureForm } from '../validations/validateSeizureForm'
import { useCreateSeizureMutation } from '../redux/services/petApi'
import AnimatedDrawerHeader from '../components/guardian/AnimatedDrawerHeader'
import GuardianSeizureGuide from '../components/guardian/seizure/GuardianSeizureGuide'
import { uploadFileToFirebase } from '../utils/firebase-helpers'

const CreateSeizureDrawer = () => {
  const { seizureDrawer } = useAppSelector((state: RootState) => state.pet)
  const { seizureForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors, handleUploadProgress } = createFormActions('seizureForm', dispatch)
  const closeSeizureDrawer = () => dispatch(setCloseSeizureDrawer())
  const [createSeizure, { isLoading }] = useCreateSeizureMutation()
  const [loading, setLoading] = useState(false)

  const handleAddSeizure = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validateSeizureForm(seizureForm.inputs, setErrors)
    if (!isValid) return

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

      await createSeizure({
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
      }).unwrap()

      dispatch(closeSeizureDrawer())
      dispatch(clearInputs({ formName: 'seizureForm' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {seizureDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeSeizureDrawer}
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
              title="Seizure Tracking"
              subtitle="Monitor and log seizure activity"
              Icon={AlertTriangle}
              closeDrawer={closeSeizureDrawer}
              color="text-yellow-500"
              iconGradient="from-yellow-500 to-orange-500"
            />

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              <SeizureForm
                inputs={seizureForm.inputs}
                errors={seizureForm.errors}
                handleInput={handleInput}
                close={closeSeizureDrawer}
                handleSubmit={handleAddSeizure}
                loading={isLoading || loading}
              />
              <GuardianSeizureGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreateSeizureDrawer
