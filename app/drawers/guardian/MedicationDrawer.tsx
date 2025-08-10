'use client'

import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import MedicationForm from '@/app/forms/MedicationForm'
import validateMedicationForm from '@/app/validations/validateMedicationForm'
import GuardianMedicationChart from '@/app/components/guardian/medications/GuardianMedicationGuildlines'
import { useCreateMedicationMutation, useUpdateMedicationMutation } from '@/app/redux/services/medicationApi'
import { setCloseMedicationDrawer } from '@/app/redux/features/medicationSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { backdropVariants, drawerVariants } from '@/app/lib/constants'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import { Pill } from 'lucide-react'
import { medicationInitialState } from '@/app/lib/initial-states/medication'

const MedicationDrawer = () => {
  const dispatch = useAppDispatch()
  const { medicationDrawer } = useAppSelector((state: RootState) => state.medication)
  const { medicationForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors } = createFormActions('medicationForm', dispatch)
  const [updateMedication, { isLoading: isUpdating }] = useUpdateMedicationMutation()
  const [createMedication, { isLoading: isCreating }] = useCreateMedicationMutation()

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'medicationForm', data: { ...medicationInitialState, isUpdating: false } }))
  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseMedicationDrawer())
  }

  const isLoading = isUpdating || isCreating
  const isUpdateMode = medicationForm?.inputs?.isUpdating

  const prepareMedicationData = () => ({
    petId: medicationForm?.inputs.petId,
    drugName: medicationForm?.inputs.drugName,
    dosage: medicationForm?.inputs.dosage,
    dosageUnit: medicationForm?.inputs.dosageUnit,
    frequency: medicationForm?.inputs.frequency,
    customFrequency: medicationForm?.inputs.customFrequency,
    startDate: medicationForm?.inputs.startDate,
    endDate: medicationForm?.inputs.endDate,
    reminderEnabled: medicationForm?.inputs.reminderEnabled,
    reminderTimes: medicationForm?.inputs.reminderTimes,
    instructions: medicationForm?.inputs.instructions,
    prescribedBy: medicationForm?.inputs.prescribedBy,
    timezoneOffset: medicationForm?.inputs.timezoneOffset
  })

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateMedicationForm(medicationForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const medicationData = prepareMedicationData()

      if (isUpdateMode) {
        await updateMedication({
          medicationId: medicationForm.inputs.id,
          ...medicationData
        }).unwrap()
      } else {
        await createMedication(medicationData).unwrap()
      }
    } catch {
    } finally {
      resetInputs()
    }
  }

  return (
    <AnimatePresence>
      {medicationDrawer && (
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
              title={isUpdateMode ? 'Edit Medication' : 'Add Medication'}
              subtitle="Asses your pet's pain level"
              Icon={Pill}
              closeDrawer={closeDrawer}
              color="text-indigo-500"
              iconGradient="from-indigo-500 to-purple-500"
            />
            <div className="flex flex-col lg:flex-row">
              <MedicationForm
                inputs={medicationForm?.inputs}
                errors={medicationForm?.errors}
                handleInput={handleInput}
                close={closeDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={isUpdateMode}
              />
              <GuardianMedicationChart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MedicationDrawer
