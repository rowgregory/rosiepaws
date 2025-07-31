import { IFeeding } from '@/app/types'

export const getTodaysFeedings = (feedings: IFeeding[]) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return feedings.filter((painScore) => {
    const feedingDate = new Date(painScore?.createdAt)
    feedingDate.setHours(0, 0, 0, 0)
    return feedingDate.getTime() === today.getTime()
  })
}
