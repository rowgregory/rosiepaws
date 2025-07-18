import { slicePet } from '@/public/data/api.data'
import { NextResponse } from 'next/server'

interface RequiredFieldsOptions {
  petId: any
  userId: any
  timeRecorded: any
  movementType: any
  activityLevel: any
  energyBefore: any
  energyAfter: any
  mobility: any
}

interface RequiredFieldsResult {
  success: boolean
  response?: NextResponse
}

export function validateMovementRequiredFields({
  petId,
  userId,
  timeRecorded,
  movementType,
  activityLevel,
  energyBefore,
  energyAfter,
  mobility
}: RequiredFieldsOptions): RequiredFieldsResult {
  if (
    !petId ||
    !userId ||
    !timeRecorded ||
    !movementType ||
    !activityLevel ||
    !energyBefore ||
    !energyAfter ||
    !mobility
  ) {
    return {
      success: false,
      response: NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, userId: ${userId}, timeRecorded: ${timeRecorded}, movementType: ${movementType}, activityLevel: ${activityLevel}, energyBefore: ${energyBefore}, energyAfter: ${energyAfter}, mobility: ${mobility} are required`,
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
