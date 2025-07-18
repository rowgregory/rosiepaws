import { slicePet } from '@/public/data/api.data'
import { NextResponse } from 'next/server'

interface RequiredFieldsOptions {
  petId: any
  foodAmount: string
  foodType: string
  timeRecorded: string
  brand: string
  moodRating: number
}

interface RequiredFieldsResult {
  success: boolean
  response?: NextResponse
}

export function validateFeedingRequiredFields({
  petId,
  foodAmount,
  foodType,
  timeRecorded,
  brand,
  moodRating
}: RequiredFieldsOptions): RequiredFieldsResult {
  if (!petId || !foodAmount || !foodType || !timeRecorded || !brand || !moodRating) {
    return {
      success: false,
      response: NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, foodAmount: ${foodAmount}, foodType: ${foodType}, timeRecorded: ${timeRecorded}, moodRating: ${moodRating}, and brand: ${brand} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }
  }

  return {
    success: true
  }
}
