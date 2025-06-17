'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { setCloseMedicationDrawer } from '../redux/features/petSlice'
import MedicationForm from '../forms/medication-form/MedicationForm'
import validateMedicationForm from '../validations/validateMedicationForm'
import { X } from 'lucide-react'
import { useCreateMedicationMutation } from '../redux/services/petApi'
import GuardianMedicationChart from '../components/guardian/GuardianMedicationChart'

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
        prescribedBy: medicationForm?.inputs.prescribedBy
      }).unwrap()

      closeMedicationDrawer()
      dispatch(clearInputs({ formName: 'medicationForm' }))
    } catch {}
  }

  return (
    <div
      className={`${
        medicationDrawer ? 'translate-x-0' : 'translate-x-full'
      } duration-500 min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col`}
    >
      <X
        onClick={closeMedicationDrawer}
        className="w-4 h-4 hover:text-indigo-500 duration-300 absolute top-5 right-5 cursor-pointer"
      />
      <h1 className="text-xl px-5 pt-4 text-[#21252c] font-bold pb-5 border-b border-zinc-150">Add Medication</h1>
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
    </div>
  )
}

export default CreateMedicationDrawer
