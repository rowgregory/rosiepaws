interface AppointmentFormInputs {
  petId: string
  date: ''
  time: ''
  serviceType: ''
}

const validateAppointmentForm = (inputs: AppointmentFormInputs, setErrors: any) => {
  const newErrors: any = {}

  if (!inputs?.date?.trim()) {
    newErrors.date = 'Please select one of your pets'
  }

  if (!inputs?.time?.trim()) {
    newErrors.time = 'Please select a time'
  }

  if (!inputs?.serviceType?.trim()) {
    newErrors.serviceType = 'Please select service type'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateAppointmentForm
