import { IMedication } from '@/app/types'

// Helper function to get active medications (not expired)
export const getActiveMedications = (medications: IMedication[]) => {
  const today = new Date()
  return medications.filter((med) => {
    if (!med.endDate) return true // No end date means ongoing
    const endDate = new Date(med.endDate)
    return endDate >= today
  })
}
