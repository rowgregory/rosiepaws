import { slicePet } from '@/public/data/api.data'
import { NextResponse } from 'next/server'

interface RequiredFieldsOptions {
  petId: any
  distance: string
  duration: string
  pace: string
  distraction: string
  timeRecorded: string
  moodRating: number
}

interface RequiredFieldsResult {
  success: boolean
  response?: NextResponse
}

export function validateWalkRequiredFields({
  petId,
  distance,
  duration,
  pace,
  distraction,
  timeRecorded,
  moodRating
}: RequiredFieldsOptions): RequiredFieldsResult {
  if (!petId || !distance || !duration || !pace || !distraction || !timeRecorded || !moodRating) {
    return {
      success: false,
      response: NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, distance: ${distance}, duration: ${duration}, pace: ${pace}, distraction: ${distraction}, timeRecorded: ${timeRecorded}, and oodRating: ${moodRating} are required`,
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
