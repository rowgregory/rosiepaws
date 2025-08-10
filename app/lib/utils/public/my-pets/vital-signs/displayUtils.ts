import {
  CAPILLARY_REFILL_TIME_LABELS,
  HYDRATION_STATUS_LABELS,
  MUCOUS_MEMBRANE_LABELS,
  PET_TYPE_LABELS
} from '@/app/lib/constants'

export const getCapillaryRefillTimeLabel = (value: string): string => {
  if (!value) return ''
  const upperValue = value.toUpperCase() as keyof typeof CAPILLARY_REFILL_TIME_LABELS
  return CAPILLARY_REFILL_TIME_LABELS[upperValue] || value
}

export const getMucousMembraneLabel = (value: string): string => {
  if (!value) return ''
  const upperValue = value.toUpperCase() as keyof typeof MUCOUS_MEMBRANE_LABELS
  return MUCOUS_MEMBRANE_LABELS[upperValue] || value
}

export const getHydrationStatusLabel = (value: string): string => {
  if (!value) return ''
  const upperValue = value.toUpperCase() as keyof typeof HYDRATION_STATUS_LABELS
  return HYDRATION_STATUS_LABELS[upperValue] || value
}

export const getPetTypeLabel = (value: string): string => {
  if (!value) return ''
  const upperValue = value.toUpperCase() as keyof typeof PET_TYPE_LABELS
  return PET_TYPE_LABELS[upperValue] || value
}
