import React from 'react'
import { useCreateWaterMutation } from '@/app/redux/services/petApi'
import { setCloseWaterDrawer } from '@/app/redux/features/petSlice'
import validateWaterIntakeForm from '@/app/validations/validateWaterForm'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions, setInputs } from '../redux/features/formSlice'
import WaterForm from '../forms/water-form/WaterForm'
import { X } from 'lucide-react'
import GuardianWaterChart from '../forms/water-form/GuardianWaterChart'

const CreateWaterDrawer = () => {
  const dispatch = useAppDispatch()
  const { waterForm } = useAppSelector((state: RootState) => state.form)
  const { pets, waterDrawer } = useAppSelector((state: RootState) => state.pet)
  const [createWater, { isLoading }] = useCreateWaterMutation()
  const { setErrors } = createFormActions('waterForm', dispatch)

  const closeWaterDrawer = () => dispatch(setCloseWaterDrawer())

  const handleInput = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    dispatch(
      setInputs({
        formName: 'waterForm',
        data: {
          [name]: value,
          // Reset related fields when intake type changes
          ...(name === 'intakeType' && {
            milliliters: '',
            relativeIntake: ''
          })
        }
      })
    )
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isValid = validateWaterIntakeForm(waterForm?.inputs, setErrors)
    if (!isValid) return

    await createWater({
      petId: waterForm?.inputs?.petId,
      intakeType: waterForm?.inputs?.intakeType,
      milliliters: waterForm?.inputs?.milliliters,
      relativeIntake: waterForm?.inputs?.relativeIntake,
      timeRecorded: waterForm?.inputs?.timeRecorded,
      moodRating: waterForm?.inputs?.moodRating,
      notes: waterForm?.inputs?.notes
    }).unwrap()

    // Reset form
    dispatch(clearInputs({ formName: 'waterForm' }))
    closeWaterDrawer()
  }

  return (
    <div
      className={`${
        waterDrawer ? 'translate-x-0' : 'translate-x-full'
      } duration-500 min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col`}
    >
      <X
        onClick={closeWaterDrawer}
        className="w-4 h-4 hover:text-indigo-500 duration-300 absolute top-5 right-5 cursor-pointer"
      />
      <h1 className="text-xl px-5 pt-4 text-[#21252c] font-bold pb-5 border-b border-zinc-150">Add Water</h1>
      <div className="flex flex-col lg:flex-row">
        <WaterForm
          inputs={waterForm?.inputs}
          errors={waterForm?.errors}
          handleInput={handleInput}
          close={closeWaterDrawer}
          handleSubmit={handleSubmit}
          loading={isLoading}
          pets={pets}
        />

        <GuardianWaterChart />
      </div>
    </div>
  )
}

export default CreateWaterDrawer
