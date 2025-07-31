import React from 'react'
import validateWaterIntakeForm from '@/app/validations/validateWaterForm'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import WaterForm from '@/app/forms/WaterForm'
import GuardianWaterChart from '@/app/components/guardian/dashboard/GuardianWaterChart'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { Droplets } from 'lucide-react'
import { setCloseWaterUpdateDrawer } from '@/app/redux/features/waterSlice'
import { useUpdateWaterMutation } from '@/app/redux/services/waterApi'

const UpdateWaterDrawer = () => {
  const dispatch = useAppDispatch()
  const { waterForm } = useAppSelector((state: RootState) => state.form)
  const { waterUpdateDrawer } = useAppSelector((state: RootState) => state.water)
  const [updateWater, { isLoading }] = useUpdateWaterMutation()
  const { setErrors, handleInput } = createFormActions('waterForm', dispatch)
  const closeWaterUpdateDrawer = () => dispatch(setCloseWaterUpdateDrawer())

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isValid = validateWaterIntakeForm(waterForm?.inputs, setErrors)
    if (!isValid) return

    await updateWater({
      waterId: waterForm?.inputs?.id,
      petId: waterForm?.inputs?.petId,
      milliliters: waterForm?.inputs?.milliliters,
      timeRecorded: new Date(waterForm?.inputs?.timeRecorded),
      moodRating: parseInt(waterForm?.inputs?.moodRating),
      notes: waterForm?.inputs?.notes
    }).unwrap()

    // Reset form
    dispatch(clearInputs({ formName: 'waterForm' }))
    closeWaterUpdateDrawer()
  }

  return (
    <AnimatePresence>
      {waterUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeWaterUpdateDrawer}
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
              title="Add Water Intake"
              subtitle="Track your pet’s daily hydration"
              Icon={Droplets}
              closeDrawer={closeWaterUpdateDrawer}
              color="text-blue-500"
              iconGradient="from-blue-500 to-cyan-500"
            />
            <div className="flex flex-col lg:flex-row">
              <WaterForm
                inputs={waterForm?.inputs}
                errors={waterForm?.errors}
                handleInput={handleInput}
                close={closeWaterUpdateDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={true}
              />

              <GuardianWaterChart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdateWaterDrawer
