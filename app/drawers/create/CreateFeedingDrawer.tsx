import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import { useCreateFeedingMutation } from '@/app/redux/services/petApi'
import { setCloseFeedingDrawer } from '@/app/redux/features/petSlice'
import FeedingForm from '@/app/forms/FeedingForm'
import validateFeedingForm from '@/app/validations/validateFeedingForm'
import GuardianFeedingChart from '@/app/components/guardian/dashboard/GuardianFeedingChart'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'

const CreateFeedingDrawer = () => {
  const { feedingDrawer } = useAppSelector((state: RootState) => state.pet)
  const { feedingForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('feedingForm', dispatch)
  const closeFeedingDrawer = () => dispatch(setCloseFeedingDrawer())
  const [createFeeding, { isLoading }] = useCreateFeedingMutation()

  const handleAddFeeding = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validateFeedingForm(feedingForm.inputs, setErrors)
    if (!isValid) return

    try {
      await createFeeding({
        petId: feedingForm.inputs.petId,
        foodAmount: feedingForm.inputs.foodAmount,
        foodType: feedingForm.inputs.foodType,
        notes: feedingForm.inputs.notes,
        brand: feedingForm.inputs.brand,
        ingredients: feedingForm.inputs.ingredients,
        moodRating: Number(feedingForm.inputs.moodRating),
        timeRecorded: new Date(feedingForm.inputs.timeRecorded),
        isCareTask: feedingForm.inputs.isCareTask
      }).unwrap()

      closeFeedingDrawer()
      dispatch(clearInputs({ formName: 'feedingForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {feedingDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeFeedingDrawer}
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
              title="Add Feeding"
              subtitle="Track your pets diet"
              Icon={Utensils}
              closeDrawer={closeFeedingDrawer}
              color="text-green-500"
              iconGradient="from-green-500 to-emerald-500"
            />
            <div className="flex flex-col lg:flex-row">
              <FeedingForm
                inputs={feedingForm.inputs}
                errors={feedingForm.errors}
                handleInput={handleInput}
                close={closeFeedingDrawer}
                handleSubmit={handleAddFeeding}
                loading={isLoading}
              />

              <GuardianFeedingChart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreateFeedingDrawer
