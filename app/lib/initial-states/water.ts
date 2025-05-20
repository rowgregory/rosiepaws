import { WaterIntake } from '@/app/types/model.types'

export const waterIntakeInitialState: WaterIntake = {
  id: '',
  amount: 0,
  timeGiven: new Date(),
  notes: '',
  petId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
