import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import validateBloodSugarForm from '@/app/validations/validateBloodSugarForm'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import BloodSugarForm from '@/app/forms/BloodSugarForm'
import BloodSugarGuide from '@/app/components/guardian/form-guides/BloodSugarGuide'
import { setCloseBloodSugarDrawer } from '@/app/redux/features/bloodSugarSlice'
import { useCreateBloodSugarMutation, useUpdateBloodSugarMutation } from '@/app/redux/services/bloodSugarApi'
import { bloodSugarInitialState } from '@/app/lib/initial-states/bloodSugar'
import { backdropVariants, drawerVariants } from '@/app/lib/constants'
import { Heart } from 'lucide-react'

const BloodSugarDrawer = () => {
  const dispatch = useAppDispatch()
  const { bloodSugarDrawer } = useAppSelector((state: RootState) => state.bloodSugar)
  const { bloodSugarForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors } = createFormActions('bloodSugarForm', dispatch)
  const [updateBloodSugar, { isLoading: isUpdating }] = useUpdateBloodSugarMutation()
  const [createBloodSugar, { isLoading: isCreating }] = useCreateBloodSugarMutation()

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'bloodSugarForm', data: { ...bloodSugarInitialState, isUpdating: false } }))
  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseBloodSugarDrawer())
  }

  const isLoading = isUpdating || isCreating
  const isUpdateMode = bloodSugarForm?.inputs?.isUpdating

  const prepareBloodSugartData = () => ({
    petId: bloodSugarForm.inputs.petId,
    value: bloodSugarForm.inputs.value,
    notes: bloodSugarForm.inputs.notes,
    timeRecorded: new Date(bloodSugarForm.inputs.timeRecorded),
    mealRelation: bloodSugarForm.inputs.mealRelation,
    measurementUnit: bloodSugarForm.inputs.measurementUnit,
    targetRange: bloodSugarForm.inputs.targetRange,
    symptoms: bloodSugarForm.inputs.symptoms,
    medicationGiven: bloodSugarForm.inputs.medicationGiven
  })

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateBloodSugarForm(bloodSugarForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const bloodSugarData = prepareBloodSugartData()

      if (isUpdateMode) {
        await updateBloodSugar({
          bloodSugarId: bloodSugarForm.inputs.id,
          ...bloodSugarData
        }).unwrap()
      } else {
        await createBloodSugar(bloodSugarData).unwrap()
      }
    } catch {
    } finally {
      resetInputs()
    }
  }

  return (
    <AnimatePresence>
      {bloodSugarDrawer && (
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
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="min-h-dvh w-full max-w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            <AnimatedDrawerHeader
              title={isUpdateMode ? 'Edit Blood Sugar' : 'Add Blood Sugar'}
              subtitle="Track your pet's appointments"
              Icon={Heart}
              closeDrawer={closeDrawer}
              color="text-red-500"
              iconGradient="from-pink-500 to-rose-500"
            />
            <div className="flex flex-col lg:flex-row">
              <BloodSugarForm
                inputs={bloodSugarForm.inputs}
                errors={bloodSugarForm.errors}
                handleInput={handleInput}
                close={closeDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={isUpdateMode}
              />
              <BloodSugarGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BloodSugarDrawer
