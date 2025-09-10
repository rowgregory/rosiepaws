import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import MovementForm from '@/app/forms/MovementForm'
import { AnimatePresence } from 'framer-motion'
import { Activity } from 'lucide-react'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import validateMovementForm from '@/app/validations/validateMovementForm'
import MovementAssessmentGuide from '@/app/components/guardian/form-guides/MovementAssessmentGuide'
import { setCloseMovementDrawer } from '@/app/redux/features/movementSlice'
import { useCreateMovementMutation, useUpdateMovementMutation } from '@/app/redux/services/movementApi'
import { movementInitialState } from '@/app/lib/initial-states/movement'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import SlideMessage from '@/app/components/auth/SlideMessage'

const MovementDrawer = () => {
  const dispatch = useAppDispatch()
  const { movementDrawer } = useAppSelector((state: RootState) => state.movement)
  const { movementForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput, setErrors, handleToggle } = createFormActions('movementForm', dispatch)
  const [createMovement, { isLoading: isCreating, error: errorCreate }] = useCreateMovementMutation() as any
  const [updateMovement, { isLoading: isUpdating, error: errorUpdate }] = useUpdateMovementMutation() as any

  const isLoading = isUpdating || isCreating
  const isUpdateMode = movementForm?.inputs?.isUpdating
  const error = errorCreate?.data?.message || errorUpdate?.data?.message

  const prepareMovementData = () => ({
    petId: movementForm.inputs.petId,
    movementType: movementForm.inputs.movementType,
    activityLevel: movementForm.inputs.activityLevel,
    timeRecorded: new Date(movementForm.inputs.timeRecorded),
    durationMinutes: Number(movementForm.inputs.durationMinutes),
    distanceMeters: Number(movementForm.inputs.distanceMeters),
    location: movementForm.inputs.location,
    indoor: movementForm.inputs.indoor,
    energyBefore: movementForm.inputs.energyBefore,
    energyAfter: movementForm.inputs.energyAfter,
    painBefore: Number(movementForm.inputs.painBefore),
    painAfter: Number(movementForm.inputs.painAfter),
    gaitQuality: movementForm.inputs.gaitQuality,
    mobility: movementForm.inputs.mobility,
    assistance: movementForm.inputs.assistance,
    wheelchair: movementForm.inputs.wheelchair,
    harness: movementForm.inputs.harness,
    leash: movementForm.inputs.leash,
    enthusiasm: Number(movementForm.inputs.enthusiasm),
    reluctance: movementForm.inputs.reluctance,
    limping: movementForm.inputs.limping,
    panting: movementForm.inputs.panting,
    restBreaks: Number(movementForm.inputs.restBreaks),
    recoveryTime: Number(movementForm.inputs.recoveryTime),
    notes: movementForm.inputs.notes
  })

  const handleAddMovement = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateMovementForm(movementForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const movementData = prepareMovementData()

      if (isUpdateMode) {
        await updateMovement({
          movementId: movementForm.inputs.id,
          ...movementData
        }).unwrap()
      } else {
        await createMovement(movementData).unwrap()
      }
    } catch {
      dispatch(setOpenSlideMessage())
    } finally {
      resetInputs()
    }
  }

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'movementForm', data: { ...movementInitialState, isUpdating: false } }))

  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseMovementDrawer())
  }

  return (
    <>
      <SlideMessage message={error} type="Error" />
      <AnimatePresence>
        {movementDrawer && (
          <>
            <Backdrop close={closeDrawer} />
            <Drawer>
              <AnimatedDrawerHeader
                title="Movement Assesment"
                subtitle="Asses your pet's movement"
                Icon={Activity}
                closeDrawer={closeDrawer}
                color="text-red-500"
                iconGradient="from-red-500 to-orange-500"
              />
              <div className="flex flex-col lg:flex-row">
                <MovementForm
                  inputs={movementForm?.inputs}
                  errors={movementForm?.errors}
                  handleInput={handleInput}
                  close={closeDrawer}
                  handleSubmit={handleAddMovement}
                  loading={isLoading}
                  handleToggle={handleToggle}
                  isUpdating={isUpdateMode}
                />
                <MovementAssessmentGuide />
              </div>
            </Drawer>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MovementDrawer
