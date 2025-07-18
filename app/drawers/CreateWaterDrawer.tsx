import React from 'react'
import { useCreateWaterMutation } from '@/app/redux/services/petApi'
import { setCloseWaterDrawer } from '@/app/redux/features/petSlice'
import validateWaterIntakeForm from '@/app/validations/validateWaterForm'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import WaterForm from '../forms/WaterForm'
import GuardianWaterChart from '../components/guardian/dashboard/GuardianWaterChart'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '../components/guardian/AnimatedDrawerHeader'
import { Droplets } from 'lucide-react'

const CreateWaterDrawer = () => {
  const dispatch = useAppDispatch()
  const { waterForm } = useAppSelector((state: RootState) => state.form)
  const { pets, waterDrawer } = useAppSelector((state: RootState) => state.pet)
  const [createWater, { isLoading }] = useCreateWaterMutation()
  const { setErrors, handleInput } = createFormActions('waterForm', dispatch)

  const closeWaterDrawer = () => dispatch(setCloseWaterDrawer())

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isValid = validateWaterIntakeForm(waterForm?.inputs, setErrors)
    if (!isValid) return

    await createWater({
      petId: waterForm?.inputs?.petId,
      milliliters: waterForm?.inputs?.milliliters,
      timeRecorded: new Date(waterForm?.inputs?.timeRecorded),
      moodRating: parseInt(waterForm?.inputs?.moodRating),
      notes: waterForm?.inputs?.notes
    }).unwrap()

    // Reset form
    dispatch(clearInputs({ formName: 'waterForm' }))
    closeWaterDrawer()
  }

  return (
    <AnimatePresence>
      {waterDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeWaterDrawer}
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
              closeDrawer={closeWaterDrawer}
              color="text-blue-500"
              iconGradient="from-blue-500 to-cyan-500"
            />
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreateWaterDrawer
