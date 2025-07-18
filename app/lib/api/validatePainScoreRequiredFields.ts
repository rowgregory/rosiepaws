import { slicePet } from '@/public/data/api.data'
import { NextResponse } from 'next/server'

interface RequiredFieldsOptions {
  petId: any
  score: any
  timeRecorded: any
}

interface RequiredFieldsResult {
  success: boolean
  response?: NextResponse
}

export function validatePainScoreRequiredFields({
  petId,
  score,
  timeRecorded
}: RequiredFieldsOptions): RequiredFieldsResult {
  if (!petId || score === undefined || score === null || !timeRecorded) {
    return {
      success: false,
      response: NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, score: ${score}, and timeRecorded: ${timeRecorded} are required`,
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
