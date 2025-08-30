import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import validateBloodSugarForm from '@/app/validations/validateBloodSugarForm'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import BloodSugarForm from '@/app/forms/BloodSugarForm'
import BloodSugarGuide from '@/app/components/guardian/form-guides/BloodSugarGuide'
import { setCloseBloodSugarDrawer } from '@/app/redux/features/bloodSugarSlice'
import { useCreateBloodSugarMutation, useUpdateBloodSugarMutation } from '@/app/redux/services/bloodSugarApi'
import { bloodSugarInitialState } from '@/app/lib/initial-states/bloodSugar'
import { Heart } from 'lucide-react'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'

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
          <Backdrop close={closeDrawer} />
          <Drawer>
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
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default BloodSugarDrawer
