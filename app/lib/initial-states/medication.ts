import { Medication } from '@/app/types/model.types'

export const medicationInitialState: Medication = {
  id: '',
  name: '',
  dosage: '',
  timeGiven: new Date(),
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
