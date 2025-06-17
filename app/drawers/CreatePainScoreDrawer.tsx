'use client'

import React, { MouseEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import AwesomeIcon from '../components/common/AwesomeIcon'
import { timesIcon } from '../lib/icons'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import { useCreatePainScoreMutation } from '../redux/services/petApi'
import { setClosePainScoreDrawer } from '../redux/features/petSlice'
import { validatePainScoreForm } from '../validations/validatePainScoreForm'
import PainScoreForm from '../forms/pain-score-form/PainScoreForm'
import GuardianPainAssessmentChart from '../components/guardian/GuardianPassAssessmentChart'

const CreatePainScoreDrawer = () => {
  const { painScoreDrawer } = useAppSelector((state: RootState) => state.pet)
  const { painScoreForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('painScoreForm', dispatch)
  const closePainScoreDrawer = () => dispatch(setClosePainScoreDrawer())
  const [createPainScore, { isLoading }] = useCreatePainScoreMutation()

  const handleAddPainScore = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validatePainScoreForm(painScoreForm.inputs, setErrors)
    if (!isValid) return

    try {
      await createPainScore({
        petId: painScoreForm.inputs.petId,
        score: painScoreForm.inputs.score,
        timeRecorded: painScoreForm.inputs.timeRecorded,
        notes: painScoreForm.inputs.notes
      }).unwrap()

      closePainScoreDrawer()
      dispatch(clearInputs({ formName: 'painScoreForm' }))
    } catch {}
  }

  return (
    <div
      className={`${
        painScoreDrawer ? 'translate-x-0' : 'translate-x-full'
      } duration-500 min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col`}
    >
      <AwesomeIcon
        onClick={() => closePainScoreDrawer()}
        icon={timesIcon}
        className="w-4 h-4 hover:text-indigo-500 duration-300 absolute top-5 right-5 cursor-pointer"
      />
      <h1 className="text-xl px-5 pt-4 text-[#21252c] font-bold pb-5 border-b border-zinc-150">Add Pain Score</h1>
      <div className="flex flex-col lg:flex-row">
        <PainScoreForm
          inputs={painScoreForm.inputs}
          errors={painScoreForm.errors}
          handleInput={handleInput}
          close={closePainScoreDrawer}
          handleSubmit={handleAddPainScore}
          loading={isLoading}
        />

        <GuardianPainAssessmentChart />
      </div>
    </div>
  )
}

export default CreatePainScoreDrawer
