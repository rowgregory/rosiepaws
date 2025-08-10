import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { validatePainScoreForm } from '@/app/validations/validatePainScoreForm'
import PainScoreForm from '@/app/forms/PainScoreForm'
import GuardianPainAssessmentChart from '@/app/components/guardian/pain/GuardianPainAssessmentChart'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { setClosePainDrawer } from '@/app/redux/features/painSlice'
import { useCreatePainScoreMutation, useUpdatePainScoreMutation } from '@/app/redux/services/painScoreApi'
import { backdropVariants, drawerVariants } from '@/app/lib/constants'
import { painScoreInitialState } from '@/app/lib/initial-states/pain-score'

const PainDrawer = () => {
  const dispatch = useAppDispatch()
  const { painDrawer } = useAppSelector((state: RootState) => state.painScore)
  const { painForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors } = createFormActions('painForm', dispatch)
  const [updatePain, { isLoading: isUpdating }] = useUpdatePainScoreMutation()
  const [createPain, { isLoading: isCreating }] = useCreatePainScoreMutation()

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'painForm', data: { ...painScoreInitialState, isUpdating: false } }))
  const closeDrawer = () => {
    resetInputs()
    dispatch(setClosePainDrawer())
  }

  const isLoading = isUpdating || isCreating
  const isUpdateMode = painForm?.inputs?.isUpdating

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
    } finally {
      resetInputs()
    }
  }

  return (
    <AnimatePresence>
      {painDrawer && (
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PainDrawer
