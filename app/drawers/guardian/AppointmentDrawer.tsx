import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { createFormActions, setInputs } from '../../redux/features/formSlice'
import AppointmentForm from '../../forms/AppointmentForm'
import { AnimatePresence } from 'framer-motion'
import AnimatedDrawerHeader from '../../components/guardian/AnimatedDrawerHeader'
import { Calendar } from 'lucide-react'
import validateAppointmentForm from '../../validations/validateAppointmentForm'
import AppointmentGuide from '../../components/guardian/form-guides/AppointmentGuide'
import { useCreateAppointmentMutation, useUpdateAppointmentMutation } from '@/app/redux/services/appointmentApi'
import { setCloseAppointmentDrawer } from '@/app/redux/features/appointmentSlice'
import { appointmentInitialState } from '@/app/lib/initial-states/appointment'
import Backdrop from '@/app/components/common/Backdrop'
import Drawer from '@/app/components/common/Drawer'
import SlideMessage from '@/app/components/auth/SlideMessage'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'

const AppointmentDrawer = () => {
  const dispatch = useAppDispatch()
  const { appointmentDrawer } = useAppSelector((state: RootState) => state.appointment)
  const { appointmentForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput, setErrors } = createFormActions('appointmentForm', dispatch)
  const [createAppointment, { isLoading: isCreating, error: errorCreate }] = useCreateAppointmentMutation() as any
  const [updateAppointment, { isLoading: isUpdating, error: errorUpdate }] = useUpdateAppointmentMutation() as any

  const isLoading = isUpdating || isCreating
  const isUpdateMode = appointmentForm?.inputs?.isUpdating
  const error = errorCreate?.data?.message || errorUpdate?.data?.message

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
      dispatch(setOpenSlideMessage())
    } finally {
      resetInputs()
    }
  }

  const resetInputs = () =>
    dispatch(setInputs({ formName: 'appointmentForm', data: { ...appointmentInitialState, isUpdating: false } }))

  const closeDrawer = () => {
    resetInputs()
    dispatch(setCloseAppointmentDrawer())
  }

  return (
    <>
      <SlideMessage message={error} type="Error" />
      <AnimatePresence>
        {appointmentDrawer && (
          <>
            <Backdrop close={closeDrawer} />
            <Drawer>
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
                <AppointmentGuide />
              </div>
            </Drawer>
          </>
        )}
      </AnimatePresence>{' '}
    </>
  )
}

export default AppointmentDrawer
