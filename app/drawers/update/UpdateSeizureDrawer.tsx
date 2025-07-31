import React, { useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { AlertTriangle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import SeizureForm from '@/app/forms/SeizureForm'
import { validateSeizureForm } from '@/app/validations/validateSeizureForm'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import GuardianSeizureGuide from '@/app/components/guardian/seizure/GuardianSeizureGuide'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { useUpdateSeizureMutation } from '@/app/redux/services/seizureApi'
import { setCloseSeizureUpdateDrawer } from '@/app/redux/features/seizureSlice'

const UpdateSeizureDrawer = () => {
  const { seizureUpdateDrawer } = useAppSelector((state: RootState) => state.seizure)
  const { seizureForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors, handleUploadProgress } = createFormActions('seizureForm', dispatch)
  const closeSeizureUpdateDrawer = () => dispatch(setCloseSeizureUpdateDrawer())
  const [updateSeizure] = useUpdateSeizureMutation()
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

      await updateSeizure({
        seizureId: seizureForm.inputs.id,
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

      dispatch(closeSeizureUpdateDrawer())
      dispatch(clearInputs({ formName: 'seizureForm' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {seizureUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeSeizureUpdateDrawer}
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
              closeDrawer={closeSeizureUpdateDrawer}
              color="text-yellow-500"
              iconGradient="from-yellow-500 to-orange-500"
            />

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              <SeizureForm
                inputs={seizureForm.inputs}
                errors={seizureForm.errors}
                handleInput={handleInput}
                close={closeSeizureUpdateDrawer}
                handleSubmit={handleAddSeizure}
                loading={loading}
                isUpdating={true}
              />
              <GuardianSeizureGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdateSeizureDrawer
