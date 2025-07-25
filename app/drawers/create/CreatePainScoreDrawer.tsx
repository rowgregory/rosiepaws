import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { useCreatePainScoreMutation } from '@/app/redux/services/petApi'
import { setClosePainScoreDrawer } from '@/app/redux/features/petSlice'
import { validatePainScoreForm } from '@/app/validations/validatePainScoreForm'
import PainScoreForm from '@/app/forms/PainScoreForm'
import GuardianPainAssessmentChart from '@/app/components/guardian/pain/GuardianPainAssessmentChart'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'

const CreatePainScoreDrawer = () => {
  const { painScoreDrawer } = useAppSelector((state: RootState) => state.pet)
  const { painScoreForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('painScoreForm', dispatch)
  const closePainScoreDrawer = () => dispatch(setClosePainScoreDrawer())
  const [createPainScore, { isLoading }] = useCreatePainScoreMutation()

  const handleAddPainScore = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validatePainScoreForm(painScoreForm.inputs, setErrors)
    if (!isValid) return

    try {
      await createPainScore({
        petId: painScoreForm.inputs.petId,
        score: painScoreForm.inputs.score,
        symptoms: painScoreForm.inputs.symptoms,
        location: painScoreForm.inputs.location,
        triggers: painScoreForm.inputs.triggers,
        relief: painScoreForm.inputs.relief,
        timeRecorded: painScoreForm.inputs.timeRecorded,
        notes: painScoreForm.inputs.notes
      }).unwrap()

      closePainScoreDrawer()
      dispatch(clearInputs({ formName: 'painScoreForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {painScoreDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closePainScoreDrawer}
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
              closeDrawer={closePainScoreDrawer}
              color="text-red-500"
              iconGradient="from-red-500 to-orange-500"
            />

            <div className="flex flex-col lg:flex-row">
              <PainScoreForm
                inputs={painScoreForm?.inputs}
                errors={painScoreForm?.errors}
                handleInput={handleInput}
                close={closePainScoreDrawer}
                handleSubmit={handleAddPainScore}
                loading={isLoading}
              />

              <GuardianPainAssessmentChart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreatePainScoreDrawer
