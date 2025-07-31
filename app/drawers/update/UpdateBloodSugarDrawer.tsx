import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import validateBloodSugarForm from '@/app/validations/validateBloodSugarForm'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import BloodSugarForm from '@/app/forms/BloodSugarForm'
import BloodSugarGuide from '@/app/components/guardian/form-guides/BloodSugarGuide'
import { setCloseBloodSugarUpdateDrawer } from '@/app/redux/features/bloodSugarSlice'
import { useUpdateBloodSugarMutation } from '@/app/redux/services/bloodSugarApi'

const UpdateBloodSugarDrawer = () => {
  const { bloodSugarUpdateDrawer } = useAppSelector((state: RootState) => state.bloodSugar)
  const { bloodSugarForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('bloodSugarForm', dispatch)
  const closeBloodSugarUpdateDrawer = () => dispatch(setCloseBloodSugarUpdateDrawer())
  const [updateBloodSugar, { isLoading }] = useUpdateBloodSugarMutation()

  const handleAddBoodSugar = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validateBloodSugarForm(bloodSugarForm.inputs, setErrors)
    if (!isValid) return

    try {
      await updateBloodSugar({
        bloodSugarId: bloodSugarForm.inputs.id,
        petId: bloodSugarForm.inputs.petId,
        value: bloodSugarForm.inputs.value,
        notes: bloodSugarForm.inputs.notes,
        timeRecorded: new Date(bloodSugarForm.inputs.timeRecorded),
        mealRelation: bloodSugarForm.inputs.mealRelation,
        measurementUnit: bloodSugarForm.inputs.measurementUnit,
        targetRange: bloodSugarForm.inputs.targetRange,
        symptoms: bloodSugarForm.inputs.symptoms,
        medicationGiven: bloodSugarForm.inputs.medicationGiven
      }).unwrap()

      closeBloodSugarUpdateDrawer()
      dispatch(clearInputs({ formName: 'bloodSugarForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {bloodSugarUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeBloodSugarUpdateDrawer}
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
              title="Blood Sugar Reading"
              subtitle="Track your pet's glucose levels"
              Icon={Heart}
              closeDrawer={closeBloodSugarUpdateDrawer}
              color="text-pink-500"
              iconGradient="from-pink-500 to-rose-500"
            />

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              <BloodSugarForm
                inputs={bloodSugarForm.inputs}
                errors={bloodSugarForm.errors}
                handleInput={handleInput}
                close={closeBloodSugarUpdateDrawer}
                handleSubmit={handleAddBoodSugar}
                loading={isLoading}
                isUpdating={true}
              />
              <BloodSugarGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdateBloodSugarDrawer
