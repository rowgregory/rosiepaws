'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { setCloseMedicationDrawer } from '../redux/features/petSlice'
import MedicationForm from '../forms/medication-form/MedicationForm'
import validateMedicationForm from '../validations/validateMedicationForm'
import { useCreateMedicationMutation } from '../redux/services/petApi'
import GuardianMedicationChart from '../components/guardian/GuardianMedicationChart'
import { AnimatePresence, motion } from 'framer-motion'
import { Pill } from 'lucide-react'
import AnimatedDrawerHeader from '../components/guardian/AnimatedDrawerHeader'

const CreateMedicationDrawer = () => {
  const { medicationDrawer } = useAppSelector((state: RootState) => state.pet)
  const { medicationForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('medicationForm', dispatch)
  const closeMedicationDrawer = () => dispatch(setCloseMedicationDrawer())
  const [createMedication, { isLoading }] = useCreateMedicationMutation()

  const handleAddMedication = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validateMedicationForm(medicationForm?.inputs, setErrors)
    if (!isValid) return

    try {
      await createMedication({
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
      }).unwrap()

      closeMedicationDrawer()
      dispatch(clearInputs({ formName: 'medicationForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {medicationDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeMedicationDrawer}
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
              title="Add Medication"
              subtitle={`Stay on top of your pet’s meds`}
              Icon={Pill}
              closeDrawer={closeMedicationDrawer}
              color="text-indigo-500"
              iconGradient="from-indigo-500 to-purple-500"
            />
            <div className="flex flex-col lg:flex-row">
              <MedicationForm
                inputs={medicationForm?.inputs}
                errors={medicationForm?.errors}
                handleInput={handleInput}
                close={closeMedicationDrawer}
                handleSubmit={handleAddMedication}
                loading={isLoading}
              />

              <GuardianMedicationChart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreateMedicationDrawer
