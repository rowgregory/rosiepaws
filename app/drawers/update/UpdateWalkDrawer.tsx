import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { TreePine } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import WalkForm from '@/app/forms/WalkForm'
import validateWalkForm from '@/app/validations/validateWalkForm'
import GuardianWalkGuide from '@/app/components/guardian/walks/GuardianWalkGuide'
import { setCloseWalkUpdateDrawer } from '@/app/redux/features/walkSlice'
import { useUpdateWalkMutation } from '@/app/redux/services/walkApi'

const UpdateWalkDrawer = () => {
  const { walkForm } = useAppSelector((state: RootState) => state.form)
  const { walkUpdateDrawer } = useAppSelector((state: RootState) => state.walk)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('walkForm', dispatch)
  const closeWalkUpdateDrawer = () => dispatch(setCloseWalkUpdateDrawer())
  const [updateWalk, { isLoading }] = useUpdateWalkMutation()

  const handleAddWalk = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isValid = validateWalkForm(walkForm.inputs, setErrors)
    if (!isValid) return

    try {
      await updateWalk({
        walkId: walkForm.inputs.id,
        petId: walkForm.inputs.petId,
        distance: walkForm.inputs.distance,
        duration: walkForm.inputs.duration,
        pace: walkForm.inputs.pace,
        distraction: walkForm.inputs.distraction,
        timeRecorded: new Date(walkForm.inputs.timeRecorded),
        moodRating: Number(walkForm.inputs.moodRating),
        notes: walkForm.inputs.notes
      }).unwrap()

      closeWalkUpdateDrawer()
      dispatch(clearInputs({ formName: 'walkForm' }))
    } finally {
    }
  }

  return (
    <AnimatePresence>
      {walkUpdateDrawer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeWalkUpdateDrawer}
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
              closeDrawer={closeWalkUpdateDrawer}
              color="text-lime-500"
              iconGradient="from-lime-500 to-yellow-500"
            />
            <div className="flex flex-col lg:flex-row">
              <WalkForm
                inputs={walkForm?.inputs}
                errors={walkForm?.errors}
                handleInput={handleInput}
                close={closeWalkUpdateDrawer}
                handleSubmit={handleAddWalk}
                loading={isLoading}
                isUpdating={true}
              />
              <GuardianWalkGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdateWalkDrawer
