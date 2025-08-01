import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import MovementForm from '@/app/forms/MovementForm'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import AnimatedDrawerHeader from '@/app/components/guardian/AnimatedDrawerHeader'
import validateMovementForm from '@/app/validations/validateMovementForm'
import MovementAssessmentGuide from '@/app/components/guardian/movements/MovementAssessmentGuide'
import { setCloseMovementUpdateDrawer } from '@/app/redux/features/movementSlice'
import { useUpdateMovementMutation } from '@/app/redux/services/movementApi'

const UpdateMovementDrawer = () => {
  const { movementForm } = useAppSelector((state: RootState) => state.form)
  const { movementUpdateDrawer } = useAppSelector((state: RootState) => state.movement)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors, handleToggle } = createFormActions('movementForm', dispatch)
  const closeMovementUpdateDrawer = () => dispatch(setCloseMovementUpdateDrawer())
  const [updateMovement, { isLoading }] = useUpdateMovementMutation()

  const handleAddMovement = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isValid = validateMovementForm(movementForm.inputs, setErrors)
    if (!isValid) return

    try {
      await updateMovement({
        movementId: movementForm.inputs.id,
        petId: movementForm.inputs.petId,
        movementType: movementForm.inputs.movementType,
        activityLevel: movementForm.inputs.activityLevel,
        timeRecorded: movementForm.inputs.timeRecorded,
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
      }).unwrap()

      closeMovementUpdateDrawer()
      dispatch(clearInputs({ formName: 'movementForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {movementUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeMovementUpdateDrawer}
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
            className="min-h-dvh w-full max-w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            {/* Header */}
            <AnimatedDrawerHeader
              title="Movement Assesment"
              subtitle="Asses your pet's movement"
              Icon={Activity}
              closeDrawer={closeMovementUpdateDrawer}
              color="text-red-500"
              iconGradient="from-red-500 to-orange-500"
            />

            <div className="flex flex-col lg:flex-row">
              <MovementForm
                inputs={movementForm?.inputs}
                errors={movementForm?.errors}
                handleInput={handleInput}
                close={closeMovementUpdateDrawer}
                handleSubmit={handleAddMovement}
                loading={isLoading}
                handleToggle={handleToggle}
                isUpdating={true}
              />

              <MovementAssessmentGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdateMovementDrawer
