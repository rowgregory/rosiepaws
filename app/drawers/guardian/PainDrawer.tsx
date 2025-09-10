import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { validatePainScoreForm } from '@/app/validations/validatePainScoreForm'
import PainScoreForm from '@/app/forms/PainScoreForm'
import GuardianPainAssessmentChart from '@/app/components/guardian/form-guides/PainAssessmentChart'
import { AnimatePresence } from 'framer-motion'
import { Activity } from 'lucide-react'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { setClosePainDrawer } from '@/app/redux/features/painSlice'
import { useCreatePainScoreMutation, useUpdatePainScoreMutation } from '@/app/redux/services/painScoreApi'
import { painScoreInitialState } from '@/app/lib/initial-states/pain-score'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'
import SlideMessage from '@/app/components/auth/SlideMessage'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'

const PainDrawer = () => {
  const dispatch = useAppDispatch()
  const { painDrawer } = useAppSelector((state: RootState) => state.painScore)
  const { painForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput, setErrors } = createFormActions('painForm', dispatch)
  const [createPain, { isLoading: isCreating, error: errorCreate }] = useCreatePainScoreMutation() as any
  const [updatePain, { isLoading: isUpdating, error: errorUpdate }] = useUpdatePainScoreMutation() as any

  const isLoading = isUpdating || isCreating
  const isUpdateMode = painForm?.inputs?.isUpdating
  const error = errorCreate?.data?.message || errorUpdate?.data?.message

  const preparePainData = () => ({
    petId: painForm.inputs.petId,
    score: painForm.inputs.score,
    symptoms: painForm.inputs.symptoms,
    location: painForm.inputs.location,
    triggers: painForm.inputs.triggers,
    relief: painForm.inputs.relief,
    notes: painForm.inputs.notes,
    timeRecorded: new Date(painForm.inputs.timeRecorded)
  })

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validatePainScoreForm(painForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const painData = preparePainData()

      if (isUpdateMode) {
        await updatePain({
          painId: painForm.inputs.id,
          ...painData
        }).unwrap()
      } else {
        await createPain(painData).unwrap()
      }
    } catch {
      dispatch(setOpenSlideMessage())
    } finally {
      resetInputs()
    }
  }

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'painForm', data: { ...painScoreInitialState, isUpdating: false } }))

  const closeDrawer = () => {
    resetInputs()
    dispatch(setClosePainDrawer())
  }

  return (
    <>
      <SlideMessage message={error} type="Error" />
      <AnimatePresence>
        {painDrawer && (
          <>
            <Backdrop close={closeDrawer} />
            <Drawer>
              <AnimatedDrawerHeader
                title={isUpdateMode ? 'Edit Pain' : 'Add Pain'}
                subtitle="Asses your pet's pain level"
                Icon={Activity}
                closeDrawer={closeDrawer}
                color="text-red-500"
                iconGradient="from-red-500 to-orange-500"
              />
              <div className="flex flex-col lg:flex-row">
                <PainScoreForm
                  inputs={painForm?.inputs}
                  errors={painForm?.errors}
                  handleInput={handleInput}
                  close={closeDrawer}
                  handleSubmit={handleSubmit}
                  loading={isLoading}
                  isUpdating={isUpdateMode}
                />
                <GuardianPainAssessmentChart />
              </div>
            </Drawer>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default PainDrawer
