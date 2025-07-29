import { getBloodSugarStatus } from './displayUtils'
import { BLOOD_SUGAR_RANGES } from '../../../../constants/public/blood-sugar'

export const getBloodSugarStats = (bloodSugarData: any[]) => {
  if (!bloodSugarData.length) return null

  const values = bloodSugarData.map((r) => Number(r.value))
  const latestReading = bloodSugarData[0]
  const latestValue = Number(latestReading?.value || 0)

  // Range analysis
  const criticalLow = values.filter((v) => v < 50).length
  const low = values.filter((v) => v >= 50 && v < 80).length
  const normal = values.filter((v) => v >= 80 && v <= 150).length
  const elevated = values.filter((v) => v > 150 && v <= 200).length
  const high = values.filter((v) => v > 200 && v <= 300).length
  const criticalHigh = values.filter((v) => v > 300).length

  // Meal relation analysis
  const mealStats = {
    FASTING: bloodSugarData.filter((r) => r.mealRelation === 'FASTING').length,
    BEFORE_MEAL: bloodSugarData.filter((r) => r.mealRelation === 'BEFORE_MEAL').length,
    AFTER_MEAL: bloodSugarData.filter((r) => r.mealRelation === 'AFTER_MEAL').length,
    BEDTIME: bloodSugarData.filter((r) => r.mealRelation === 'BEDTIME').length,
    RANDOM: bloodSugarData.filter((r) => r.mealRelation === 'RANDOM').length
  }

  // Medication correlation
  const withMedication = bloodSugarData.filter((r) => r.medicationGiven)
  const withoutMedication = bloodSugarData.filter((r) => !r.medicationGiven)
  const avgWithMed =
    withMedication.length > 0
      ? Math.round(withMedication.reduce((sum, r) => sum + Number(r.value), 0) / withMedication.length)
      : 0
  const avgWithoutMed =
    withoutMedication.length > 0
      ? Math.round(withoutMedication.reduce((sum, r) => sum + Number(r.value), 0) / withoutMedication.length)
      : 0

  // Symptoms analysis
  const readingsWithSymptoms = bloodSugarData.filter((r) => r.symptoms && r.symptoms !== 'None observed').length

  return {
    latestValue,
    latestStatus: getBloodSugarStatus(latestValue),
    average: Math.round(values.reduce((sum, v) => sum + v, 0) / values.length),
    min: Math.min(...values),
    max: Math.max(...values),
    total: bloodSugarData.length,
    outOfRange: criticalLow + low + elevated + high + criticalHigh,
    rangeBreakdown: { criticalLow, low, normal, elevated, high, criticalHigh },
    mealStats,
    medicationStats: {
      withMedication: withMedication.length,
      withoutMedication: withoutMedication.length,
      avgWithMed,
      avgWithoutMed
    },
    symptomsCount: readingsWithSymptoms
  }
}

export const getBloodSugarRange2 = (value: number) => {
  return BLOOD_SUGAR_RANGES.find((range) => value >= range.min && value <= range.max)
}

export const parseBloodSugarValue = (value: any): number => {
  if (value === null || value === undefined || value === '') return 0
  const parsed = parseInt(String(value))
  return isNaN(parsed) ? 0 : parsed
}

export const isBloodSugarFormValid = (inputs: any) => {
  return inputs?.petId && inputs?.value && inputs?.timeRecorded
}
