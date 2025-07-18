import { IWalk } from '@/app/types/entities'

export const walkInitialState: IWalk = {
  id: '',
  petId: '',
  distance: '',
  duration: '',
  pace: '',
  distraction: '',
  moodRating: 0,
  notes: '',
  timeRecorded: '',
  movement: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
