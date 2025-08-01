import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { clearInputs, createFormActions } from '../../redux/features/formSlice'
import AppointmentForm from '../../forms/AppointmentForm'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDrawerHeader from '../../components/guardian/AnimatedDrawerHeader'
import { Calendar } from 'lucide-react'
import validateAppointmentForm from '../../validations/validateAppointmentForm'
import AppointmentTips from '../../components/guardian/appointments/AppointmentTips'
import { useUpdateAppointmentMutation } from '@/app/redux/services/appointmentApi'
import { setCloseAppointmentUpdateDrawer } from '@/app/redux/features/appointmentSlice'

const UpdateAppointmentDrawer = () => {
  const dispatch = useAppDispatch()
  const { appointmentForm } = useAppSelector((state: RootState) => state.form)
  const { appointmentUpdateDrawer } = useAppSelector((state: RootState) => state.appointment)
  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation()
  const { setErrors, handleInput } = createFormActions('appointmentForm', dispatch)

  const closeAppointmentDrawer = () => dispatch(setCloseAppointmentUpdateDrawer())

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateAppointmentForm(appointmentForm?.inputs, setErrors)) return

    await updateAppointment({
      appointmentId: appointmentForm.inputs.id,
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
    }).unwrap()

    dispatch(clearInputs({ formName: 'appointmentForm' }))
    closeAppointmentDrawer()
  }

  return (
    <AnimatePresence>
      {appointmentUpdateDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeAppointmentDrawer}
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
              title="Add Appointment"
              subtitle="Track your pet’s appointments"
              Icon={Calendar}
              closeDrawer={closeAppointmentDrawer}
              color="text-violet-500"
              iconGradient="from-violet-500 to-gray-500"
            />
            <div className="flex flex-col lg:flex-row">
              <AppointmentForm
                inputs={appointmentForm?.inputs}
                errors={appointmentForm?.errors}
                handleInput={handleInput}
                close={closeAppointmentDrawer}
                handleSubmit={handleSubmit}
                loading={isLoading}
                isUpdating={true}
              />

              <AppointmentTips />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpdateAppointmentDrawer
