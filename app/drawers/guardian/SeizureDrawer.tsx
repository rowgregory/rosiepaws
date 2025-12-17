import { useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { AlertTriangle } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import SeizureForm from '@/app/forms/SeizureForm'
import { validateSeizureForm } from '@/app/validations/validateSeizureForm'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import GuardianSeizureGuide from '@/app/components/guardian/form-guides/SeizureGuide'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { useCreateSeizureMutation, useUpdateSeizureMutation } from '@/app/redux/services/seizureApi'
import { setCloseSeizureDrawer } from '@/app/redux/features/seizureSlice'
import { seizureInitialState } from '@/app/lib/initial-states/seizure'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'
import SlideMessage from '@/app/components/auth/SlideMessage'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'

const SeizureDrawer = () => {
  const dispatch = useAppDispatch()
  const { seizureDrawer } = useAppSelector((state: RootState) => state.seizure)
  const { seizureForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput, setErrors, handleUploadProgress } = createFormActions('seizureForm', dispatch)
  const [createSeizure, { isLoading: isCreating, error: errorCreate }] = useCreateSeizureMutation() as any
  const [updateSeizure, { isLoading: isUpdating, error: errorUpdate }] = useUpdateSeizureMutation() as any
  const [loading, setLoading] = useState(false)

  const isLoading = isUpdating || isCreating || loading
  const isUpdateMode = seizureForm?.inputs?.isUpdating
  const error = errorCreate?.data?.message || errorUpdate?.data?.message

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
      dispatch(setOpenSlideMessage())
    } finally {
      setLoading(false)
      resetInputs()
    }
  }

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'seizureForm', data: { ...seizureInitialState, isUpdating: false } }))

  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseSeizureDrawer())
  }

  return (
    <>
      <SlideMessage message={error} type="Error" />
      <AnimatePresence>
        {seizureDrawer && (
          <>
            <Backdrop close={closeDrawer} />
            <Drawer>
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
            </Drawer>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default SeizureDrawer
