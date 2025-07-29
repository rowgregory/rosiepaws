import { IFeeding } from '@/app/types/entities'

export const getTodaysFeedings = (feedings: IFeeding[]) => {
  const today = new Date().toDateString()
  return feedings.filter((feeding) => new Date(feeding.createdAt).toDateString() === today).length
}
