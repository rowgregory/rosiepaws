import React from 'react'
import { useCreateWaterMutation } from '@/app/redux/services/petApi'
import { setCloseWaterDrawer } from '@/app/redux/features/petSlice'
import validateWaterIntakeForm from '@/app/validations/validateWaterForm'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions, setInputs } from '../redux/features/formSlice'
import WaterForm from '../forms/water-form/WaterForm'
import GuardianWaterChart from '../forms/water-form/GuardianWaterChart'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '../components/guardian/AnimatedDrawerHeader'
import { Droplets } from 'lucide-react'

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
    <AnimatePresence>
      {waterDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
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
