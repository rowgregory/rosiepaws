import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import WaterForm from '@/app/forms/WaterForm'
import GuardianWaterChart from '@/app/components/guardian/dashboard/GuardianWaterChart'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { Droplets } from 'lucide-react'
import { setCloseWaterDrawer } from '@/app/redux/features/waterSlice'
import { useCreateWaterMutation, useUpdateWaterMutation } from '@/app/redux/services/waterApi'
import { backdropVariants } from '@/app/lib/constants'
import validateWaterForm from '@/app/validations/validateWaterForm'
import { waterInitialState } from '@/app/lib/initial-states/water'

const WaterDrawer = () => {
  const dispatch = useAppDispatch()
  const { waterDrawer } = useAppSelector((state: RootState) => state.water)
  const { waterForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors } = createFormActions('waterForm', dispatch)
  const [updateWater, { isLoading: isUpdating }] = useUpdateWaterMutation()
  const [createWater, { isLoading: isCreating }] = useCreateWaterMutation()

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'waterForm', data: { ...waterInitialState, isUpdating: false } }))
  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseWaterDrawer())
  }

  const isLoading = isUpdating || isCreating
  const isUpdateMode = waterForm?.inputs?.isUpdating

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
    } finally {
      resetInputs()
    }
  }

  return (
    <AnimatePresence>
      {waterDrawer && (
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
              <GuardianWaterChart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default WaterDrawer
