import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import WaterForm from '@/app/forms/WaterForm'
import WaterGuide from '@/app/components/guardian/form-guides/WaterGuide'
import { AnimatePresence } from 'framer-motion'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { Droplets } from 'lucide-react'
import { setCloseWaterDrawer } from '@/app/redux/features/waterSlice'
import { useCreateWaterMutation, useUpdateWaterMutation } from '@/app/redux/services/waterApi'
import validateWaterForm from '@/app/validations/validateWaterForm'
import { waterInitialState } from '@/app/lib/initial-states/water'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import SlideMessage from '@/app/components/auth/SlideMessage'

const WaterDrawer = () => {
  const dispatch = useAppDispatch()
  const { waterDrawer } = useAppSelector((state: RootState) => state.water)
  const { waterForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors } = createFormActions('waterForm', dispatch)
  const [createWater, { isLoading: isCreating, error: errorCreate }] = useCreateWaterMutation() as any
  const [updateWater, { isLoading: isUpdating, error: errorUpdate }] = useUpdateWaterMutation() as any

  const isLoading = isUpdating || isCreating
  const isUpdateMode = waterForm?.inputs?.isUpdating
  const error = errorCreate?.data?.message || errorUpdate?.data?.message

  const prepareWaterData = () => ({
    petId: waterForm?.inputs?.petId,
    pet: {
      name: waterForm?.inputs?.petName
    },
    milliliters: waterForm?.inputs?.milliliters,
    moodRating: parseInt(waterForm?.inputs?.moodRating),
    notes: waterForm?.inputs?.notes,
    timeRecorded: new Date(waterForm?.inputs?.timeRecorded),
    createdAt: new Date()
  })

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateWaterForm(waterForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const waterData = prepareWaterData()

      if (isUpdateMode) {
        await updateWater({
          waterId: waterForm.inputs.id,
          ...waterData
        }).unwrap()
      } else {
        await createWater(waterData).unwrap()
      }
    } catch {
      dispatch(setOpenSlideMessage())
    } finally {
      resetInputs()
    }
  }

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'waterForm', data: { ...waterInitialState, isUpdating: false } }))

  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseWaterDrawer())
  }

  return (
    <>
      <SlideMessage message={error} type="Error" />
      <AnimatePresence>
        {waterDrawer && (
          <>
            <Backdrop close={closeDrawer} />
            <Drawer>
              <AnimatedDrawerHeader
                title={isUpdateMode ? 'Edit Water' : 'Add Water'}
                subtitle="Track your pet’s daily hydration"
                Icon={Droplets}
                closeDrawer={closeDrawer}
                color="text-blue-500"
                iconGradient="from-blue-500 to-cyan-500"
              />
              <div className="flex flex-col lg:flex-row">
                <WaterForm
                  inputs={waterForm?.inputs}
                  errors={waterForm?.errors}
                  handleInput={handleInput}
                  close={closeDrawer}
                  handleSubmit={handleSubmit}
                  loading={isLoading}
                  isUpdating={isUpdateMode}
                />
                <WaterGuide />
              </div>
            </Drawer>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default WaterDrawer
