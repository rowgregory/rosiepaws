import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import FeedingForm from '@/app/forms/FeedingForm'
import validateFeedingForm from '@/app/validations/validateFeedingForm'
import FeedingGuide from '@/app/components/guardian/form-guides/FeedingGuide'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { setCloseFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { useCreateFeedingMutation, useUpdateFeedingMutation } from '@/app/redux/services/feedingApi'
import { backdropVariants } from '@/app/lib/constants'
import { feedingInitialState } from '@/app/lib/initial-states/feeding'

const FeedingDrawer = () => {
  const dispatch = useAppDispatch()
  const { feedingDrawer } = useAppSelector((state: RootState) => state.feeding)
  const { feedingForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors } = createFormActions('feedingForm', dispatch)
  const [updateFeeding, { isLoading: isUpdating }] = useUpdateFeedingMutation()
  const [createFeeding, { isLoading: isCreating }] = useCreateFeedingMutation()

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'feedingForm', data: { ...feedingInitialState, isUpdating: false } }))
  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseFeedingDrawer())
  }

  const isLoading = isUpdating || isCreating
  const isUpdateMode = feedingForm?.inputs?.isUpdating

  const prepareFeedingData = () => ({
    petId: feedingForm.inputs.petId,
    foodAmount: feedingForm.inputs.foodAmount,
    foodType: feedingForm.inputs.foodType,
    notes: feedingForm.inputs.notes,
    brand: feedingForm.inputs.brand,
    ingredients: feedingForm.inputs.ingredients,
    moodRating: Number(feedingForm.inputs.moodRating),
    timeRecorded: new Date(feedingForm.inputs.timeRecorded)
  })

  const handleAddFeeding = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateFeedingForm(feedingForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const feedingData = prepareFeedingData()

      if (isUpdateMode) {
        await updateFeeding({
          feedingId: feedingForm.inputs.id,
          ...feedingData
        }).unwrap()
      } else {
        await createFeeding(feedingData).unwrap()
      }
    } catch {
    } finally {
      resetInputs()
    }
  }

  return (
    <AnimatePresence>
      {feedingDrawer && (
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="min-h-dvh w-full lg:w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            <AnimatedDrawerHeader
              title={isUpdateMode ? 'Edit Feeding' : 'Add Feeding'}
              subtitle="Track your pets diet"
              Icon={Utensils}
              closeDrawer={closeDrawer}
              color="text-green-500"
              iconGradient="from-green-500 to-emerald-500"
            />
            <div className="flex flex-col lg:flex-row">
              <FeedingForm
                inputs={feedingForm.inputs}
                errors={feedingForm.errors}
                handleInput={handleInput}
                close={closeDrawer}
                handleSubmit={handleAddFeeding}
                loading={isLoading}
                isUpdating={isUpdateMode}
              />

              <FeedingGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FeedingDrawer
