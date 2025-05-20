import { Appointment } from '@/app/types/model.types'

export const appointmentInitialState: Appointment = {
  id: '',
  date: new Date(),
  reason: '',
  location: '',
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
