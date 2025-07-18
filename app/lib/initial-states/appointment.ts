import { AppointmentStatus, AppointmentType, IAppointment } from '@/app/types/entities'
import { petInitialState } from './pet'

export const appointmentInitialState: IAppointment = {
  id: '',
  date: '',
  time: '09:00',
  serviceType: AppointmentType.CHECKUP,
  description: '',
  status: AppointmentStatus.SCHEDULED,
  veterinarian: '',
  notes: '',
  petId: '',
  pet: petInitialState,

  createdAt: new Date(),
  updatedAt: new Date()
}

export const appointmentInitialError = {
  id: '',
  date: '',
  time: '',
  serviceType: '',
  description: '',
  status: '',
  veterinarian: '',
  notes: '',
  petId: ''
}
