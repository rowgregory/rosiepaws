import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { TreePine } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import WalkForm from '@/app/forms/WalkForm'
import validateWalkForm from '@/app/validations/validateWalkForm'
import GuardianWalkGuide from '@/app/components/guardian/walks/GuardianWalkGuide'
import { setCloseWalkCreateDrawer } from '@/app/redux/features/walkSlice'
import { useCreateWalkMutation } from '@/app/redux/services/walkApi'

const CreateWalkDrawer = () => {
  const { walkCreateDrawer } = useAppSelector((state: RootState) => state.walk)
  const { walkForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('walkForm', dispatch)
  const closeWalkDrawer = () => dispatch(setCloseWalkCreateDrawer())
  const [createWalk, { isLoading }] = useCreateWalkMutation()

  const handleAddWalk = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validateWalkForm(walkForm.inputs, setErrors)
    if (!isValid) return

    try {
      await createWalk({
        petId: walkForm.inputs.petId,
        distance: walkForm.inputs.distance,
        duration: walkForm.inputs.duration,
        pace: walkForm.inputs.pace,
        distraction: walkForm.inputs.distraction,
        timeRecorded: new Date(walkForm.inputs.timeRecorded),
        moodRating: walkForm.inputs.moodRating,
        notes: walkForm.inputs.notes
      }).unwrap()

      closeWalkDrawer()
      dispatch(clearInputs({ formName: 'walkForm' }))
    } finally {
    }
  }

  return (
    <AnimatePresence>
      {walkCreateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeWalkDrawer}
          />

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
            <AnimatedDrawerHeader
              title="Log Walk"
              subtitle="Track your pet's exercise, pace, and mood"
              Icon={TreePine}
              closeDrawer={closeWalkDrawer}
              color="text-lime-500"
              iconGradient="from-lime-500 to-yellow-500"
            />
            <div className="flex flex-col lg:flex-row">
              <WalkForm
                inputs={walkForm?.inputs}
                errors={walkForm?.errors}
                handleInput={handleInput}
                close={closeWalkDrawer}
                handleSubmit={handleAddWalk}
                loading={isLoading}
              />
              <GuardianWalkGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreateWalkDrawer
