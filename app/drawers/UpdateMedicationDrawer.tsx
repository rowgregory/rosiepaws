'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { setCloseUpdateMedicationDrawer } from '../redux/features/petSlice'
import MedicationForm from '../forms/MedicationForm'
import validateMedicationForm from '../validations/validateMedicationForm'
import { X } from 'lucide-react'
import GuardianMedicationChart from '../components/guardian/medications/GuardianMedicationGuildlines'
import { useUpdateMedicationMutation } from '../redux/services/petApi'

const UpdateMedicationDrawer = () => {
  const { updateMedicationDrawer } = useAppSelector((state: RootState) => state.pet)
  const { medicationForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('medicationForm', dispatch)
  const closeMedicationDrawer = () => dispatch(setCloseUpdateMedicationDrawer())
  const [updateMedication, { isLoading }] = useUpdateMedicationMutation()

  const handleUpdateMedication = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validateMedicationForm(medicationForm?.inputs, setErrors)
    if (!isValid) return

    try {
      await updateMedication({
        id: medicationForm?.inputs?.id,
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
    <div
      className={`${
        updateMedicationDrawer ? 'translate-x-0' : 'translate-x-full'
      } duration-500 min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col`}
    >
      <X
        onClick={closeMedicationDrawer}
        className="w-4 h-4 hover:text-indigo-500 duration-300 absolute top-5 right-5 cursor-pointer"
      />
      <h1 className="text-xl px-5 pt-4 text-[#21252c] font-bold pb-5 border-b border-zinc-150">Update Medication</h1>
      <div className="flex flex-col lg:flex-row">
        <MedicationForm
          inputs={medicationForm?.inputs}
          errors={medicationForm?.errors}
          handleInput={handleInput}
          close={closeMedicationDrawer}
          handleSubmit={handleUpdateMedication}
          loading={isLoading}
          isUpdating
        />

        <GuardianMedicationChart />
      </div>
    </div>
  )
}

export default UpdateMedicationDrawer
