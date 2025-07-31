import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { validatePainScoreForm } from '@/app/validations/validatePainScoreForm'
import PainScoreForm from '@/app/forms/PainScoreForm'
import GuardianPainAssessmentChart from '@/app/components/guardian/pain/GuardianPainAssessmentChart'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { setClosePainScoreUpdateDrawer } from '@/app/redux/features/painScoreSlice'
import { useUpdatePainScoreMutation } from '@/app/redux/services/painScoreApi'

const UpdatePainScoreDrawer = () => {
  const { painScoreUpdateDrawer } = useAppSelector((state: RootState) => state.painScore)
  const { painScoreForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('painScoreForm', dispatch)
  const closePainScoreUpdateDrawer = () => dispatch(setClosePainScoreUpdateDrawer())
  const [updatePainScore, { isLoading }] = useUpdatePainScoreMutation()

  const handleUpdatePainScore = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isValid = validatePainScoreForm(painScoreForm.inputs, setErrors)
    if (!isValid) return

    try {
      await updatePainScore({
        painScoreId: painScoreForm.inputs.id,
        petId: painScoreForm.inputs.petId,
        score: painScoreForm.inputs.score,
        symptoms: painScoreForm.inputs.symptoms,
        location: painScoreForm.inputs.location,
        triggers: painScoreForm.inputs.triggers,
        relief: painScoreForm.inputs.relief,
        timeRecorded: painScoreForm.inputs.timeRecorded,
        notes: painScoreForm.inputs.notes
      }).unwrap()

      closePainScoreUpdateDrawer()
      dispatch(clearInputs({ formName: 'painScoreForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {painScoreUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closePainScoreUpdateDrawer}
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
            className="min-h-dvh w-full max-w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            {/* Header */}
            <AnimatedDrawerHeader
              title="Pain Score Assesment"
              subtitle="Asses your pet's pain level"
              Icon={Activity}
              closeDrawer={closePainScoreUpdateDrawer}
              color="text-red-500"
              iconGradient="from-red-500 to-orange-500"
            />

            <div className="flex flex-col lg:flex-row">
              <PainScoreForm
                inputs={painScoreForm?.inputs}
                errors={painScoreForm?.errors}
                handleInput={handleInput}
                close={closePainScoreUpdateDrawer}
                handleSubmit={handleUpdatePainScore}
                loading={isLoading}
                isUpdating={true}
              />

              <GuardianPainAssessmentChart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdatePainScoreDrawer
