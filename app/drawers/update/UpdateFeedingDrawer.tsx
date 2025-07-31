import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import FeedingForm from '@/app/forms/FeedingForm'
import validateFeedingForm from '@/app/validations/validateFeedingForm'
import FeedingGuide from '@/app/components/guardian/form-guides/FeedingGuide'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { setCloseFeedingUpdateDrawer } from '@/app/redux/features/feedingSlice'
import { useUpdateFeedingMutation } from '@/app/redux/services/feedingApi'

const UpdateFeedingDrawer = () => {
  const { feedingUpdateDrawer } = useAppSelector((state: RootState) => state.feeding)
  const { feedingForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('feedingForm', dispatch)
  const closeFeedingUpdateDrawer = () => dispatch(setCloseFeedingUpdateDrawer())
  const [updateFeeding, { isLoading }] = useUpdateFeedingMutation()

  const handleAddFeeding = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isValid = validateFeedingForm(feedingForm.inputs, setErrors)
    if (!isValid) return

    try {
      await updateFeeding({
        feedingId: feedingForm.inputs.id,
        petId: feedingForm.inputs.petId,
        foodAmount: feedingForm.inputs.foodAmount,
        foodType: feedingForm.inputs.foodType,
        notes: feedingForm.inputs.notes,
        brand: feedingForm.inputs.brand,
        ingredients: feedingForm.inputs.ingredients,
        moodRating: Number(feedingForm.inputs.moodRating),
        timeRecorded: new Date(feedingForm.inputs.timeRecorded)
      }).unwrap()

      closeFeedingUpdateDrawer()
      dispatch(clearInputs({ formName: 'feedingForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {feedingUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeFeedingUpdateDrawer}
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
              closeDrawer={closeFeedingUpdateDrawer}
              color="text-green-500"
              iconGradient="from-green-500 to-emerald-500"
            />
            <div className="flex flex-col lg:flex-row">
              <FeedingForm
                inputs={feedingForm.inputs}
                errors={feedingForm.errors}
                handleInput={handleInput}
                close={closeFeedingUpdateDrawer}
                handleSubmit={handleAddFeeding}
                loading={isLoading}
                isUpdating={true}
              />

              <FeedingGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdateFeedingDrawer
