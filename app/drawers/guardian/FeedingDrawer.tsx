import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import FeedingForm from '@/app/forms/FeedingForm'
import validateFeedingForm from '@/app/validations/validateFeedingForm'
import FeedingGuide from '@/app/components/guardian/form-guides/FeedingGuide'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { setCloseFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { useCreateFeedingMutation, useUpdateFeedingMutation } from '@/app/redux/services/feedingApi'
import { feedingInitialState } from '@/app/lib/initial-states/feeding'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'

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
          <Backdrop close={closeDrawer} />
          <Drawer>
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
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default FeedingDrawer
