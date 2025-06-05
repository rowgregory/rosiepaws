import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import AwesomeIcon from '../components/common/AwesomeIcon'
import { timesIcon } from '../lib/icons'
import { useCreateFeedingMutation } from '../redux/services/petApi'
import { setCloseFeedingDrawer } from '../redux/features/petSlice'
import FeedingForm from '../forms/FeedingForm'
import validateFeedingForm from '../validations/validateFeedingForm'
import GuardianFeedingChart from '../components/guardian/GuardianFeedingChart'

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
        moodRating: +feedingForm.inputs.moodRating,
        timeFed: new Date(feedingForm.inputs.timeFed)
      }).unwrap()

      closeFeedingDrawer()
      dispatch(clearInputs({ formName: 'feedingForm' }))
    } catch {}
  }

  return (
    <div
      className={`${
        feedingDrawer ? 'translate-x-0' : 'translate-x-full'
      } duration-500 min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col`}
    >
      <AwesomeIcon
        onClick={() => closeFeedingDrawer()}
        icon={timesIcon}
        className="w-4 h-4 hover:text-indigo-500 duration-300 absolute top-5 right-5 cursor-pointer"
      />
      <h1 className="text-xl px-5 pt-4 text-[#21252c] font-bold pb-5 border-b border-zinc-150">Add Feeding</h1>
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
    </div>
  )
}

export default CreateFeedingDrawer
