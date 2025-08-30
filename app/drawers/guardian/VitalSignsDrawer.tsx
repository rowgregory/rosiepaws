import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { TreePine } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import VitalSignsGuide from '@/app/components/guardian/form-guides/VitalSignsGuide'
import { useCreateVitalSignsMutation, useUpdateVitalSignsMutation } from '@/app/redux/services/vitalSignsApi'
import { setCloseVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'
import validateVitalSignsForm from '@/app/validations/validateVitalSignsForm'
import VitalSignsForm from '@/app/forms/VitalSignsForm'
import { vitalSignsInitialState } from '@/app/lib/initial-states/vital-signs'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'

const VitalSignsDrawer = () => {
  const dispatch = useAppDispatch()
  const { vitalSignsDrawer } = useAppSelector((state: RootState) => state.vitalSigns)
  const { vitalSignsForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput, setErrors } = createFormActions('vitalSignsForm', dispatch)
  const [updateVitalSigns, { isLoading: isUpdating }] = useUpdateVitalSignsMutation()
  const [createVitalSigns, { isLoading: isCreating }] = useCreateVitalSignsMutation()

  const isLoading = isUpdating || isCreating
  const isUpdateMode = vitalSignsForm?.inputs?.isUpdating

  const prepareVitalSignsData = () => ({
    petId: vitalSignsForm?.inputs?.petId,
    pet: {
      name: vitalSignsForm?.inputs?.petName,
      type: vitalSignsForm?.inputs.petType
    },
    temperature: Number(vitalSignsForm?.inputs?.temperature),
    heartRate: Number(vitalSignsForm?.inputs?.heartRate),
    respiratoryRate: Number(vitalSignsForm?.inputs?.respiratoryRate),
    weight: Number(vitalSignsForm?.inputs?.weight),
    bloodPressure: vitalSignsForm?.inputs?.bloodPressure,
    capillaryRefillTime: vitalSignsForm?.inputs?.capillaryRefillTime,
    mucousMembranes: vitalSignsForm?.inputs?.mucousMembranes,
    hydrationStatus: vitalSignsForm?.inputs?.hydrationStatus,
    timeRecorded: new Date(vitalSignsForm?.inputs?.timeRecorded),
    notes: vitalSignsForm?.inputs?.notes
  })

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateVitalSignsForm(vitalSignsForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const vitalSignsData = prepareVitalSignsData()

      if (isUpdateMode) {
        await updateVitalSigns({
          vitalSignsId: vitalSignsForm.inputs.id,
          ...vitalSignsData
        }).unwrap()
      } else {
        await createVitalSigns(vitalSignsData).unwrap()
      }
    } catch {
    } finally {
      resetInputs()
    }
  }

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'vitalSignsForm', data: { ...vitalSignsInitialState, isUpdating: false } }))

  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseVitalSignsDrawer())
  }

  return (
    <AnimatePresence>
      {vitalSignsDrawer && (
        <>
          <Backdrop close={closeDrawer} />
          <Drawer>
            <AnimatedDrawerHeader
              title="Log Vital Signs"
              subtitle="Track your pet's vital signs"
              Icon={TreePine}
              closeDrawer={closeDrawer}
              color="text-lime-500"
              iconGradient="from-lime-500 to-yellow-500"
            />
            <div className="flex flex-col lg:flex-row">
              <VitalSignsForm
                inputs={vitalSignsForm?.inputs}
                errors={vitalSignsForm?.errors}
                handleInput={handleInput}
                close={closeDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={isUpdateMode}
              />
              <VitalSignsGuide />
            </div>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default VitalSignsDrawer
