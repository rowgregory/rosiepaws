import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '../../redux/features/formSlice'
import AppointmentForm from '../../forms/AppointmentForm'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '../../components/guardian/AnimatedDrawerHeader'
import { Calendar } from 'lucide-react'
import validateAppointmentForm from '../../validations/validateAppointmentForm'
import AppointmentTips from '../../components/guardian/appointments/AppointmentTips'
import { useCreateAppointmentMutation, useUpdateAppointmentMutation } from '@/app/redux/services/appointmentApi'
import { setCloseAppointmentDrawer } from '@/app/redux/features/appointmentSlice'
import { backdropVariants, drawerVariants } from '@/app/lib/constants'
import { appointmentInitialState } from '@/app/lib/initial-states/appointment'

const AppointmentDrawer = () => {
  const dispatch = useAppDispatch()
  const { appointmentDrawer } = useAppSelector((state: RootState) => state.appointment)
  const { appointmentForm } = useAppSelector((state: RootState) => state.form)

  const { handleInput, setErrors } = createFormActions('appointmentForm', dispatch)
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation()
  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation()

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'appointmentForm', data: { ...appointmentInitialState, isUpdating: false } }))
  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseAppointmentDrawer())
  }

  const isLoading = isUpdating || isCreating
  const isUpdateMode = appointmentForm?.inputs?.isUpdating

  const prepareAppointmentData = () => ({
    petId: appointmentForm?.inputs?.petId,
    date: new Date(appointmentForm?.inputs?.date),
    time: appointmentForm?.inputs?.time,
    serviceType: appointmentForm?.inputs?.serviceType,
    description: appointmentForm?.inputs?.description,
    status: appointmentForm?.inputs?.status,
    veterinarian: appointmentForm?.inputs?.veterinarian,
    reminderTime: appointmentForm?.inputs?.reminderTime,
    reminderEnabled: appointmentForm?.inputs?.reminderEnabled,
    notes: appointmentForm?.inputs?.notes
  })

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateAppointmentForm(appointmentForm.inputs, setErrors)) return

    closeDrawer()

    try {
      const appointmentData = prepareAppointmentData()

      if (isUpdateMode) {
        await updateAppointment({
          appointmentId: appointmentForm.inputs.id,
          ...appointmentData
        }).unwrap()
      } else {
        await createAppointment(appointmentData).unwrap()
      }
    } catch {
    } finally {
      resetInputs()
    }
  }

  return (
    <AnimatePresence>
      {appointmentDrawer && (
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
              title={isUpdateMode ? 'Edit Appointment' : 'Add Appointment'}
              subtitle="Track your pet's appointments"
              Icon={Calendar}
              closeDrawer={closeDrawer}
              color="text-red-500"
              iconGradient="from-red-500 to-orange-500"
            />
            <div className="flex flex-col lg:flex-row">
              <AppointmentForm
                inputs={appointmentForm?.inputs}
                errors={appointmentForm?.errors}
                handleInput={handleInput}
                close={closeDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={isUpdateMode}
              />
              <AppointmentTips />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AppointmentDrawer
