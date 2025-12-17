import prisma from '@/prisma/client'
import { slicePet, sliceVitalSigns } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { CapillaryRefillTime, HydrationStatus, MucousMembraneColor } from '@/app/types'
import { vitalSignsCreateTokenCost } from '@/app/lib/constants/public/token'
import { requireAuth } from '@/app/lib/auth/getServerSession'

interface CreateVitalSignRequest {
  petId: string
  bloodPressure: string
  capillaryRefillTime: CapillaryRefillTime
  heartRate: number
  hydrationStatus: HydrationStatus
  mucousMembranes: MucousMembraneColor
  respiratoryRate: number
  temperature: number
  timeRecorded: string
  weight: number
  notes?: string
}

export async function POST(req: NextRequest) {
  try {
  const { user } = await requireAuth();

    const {
      petId,
      bloodPressure,
      capillaryRefillTime,
      heartRate,
      hydrationStatus,
      mucousMembranes,
      respiratoryRate,
      temperature,
      timeRecorded,
      weight,
      notes
    }: CreateVitalSignRequest = await req.json()

    if (!petId && !timeRecorded) {
      return NextResponse.json(
        {
          message: `Missing Required fields: petId: ${petId}, timeRecorded: ${timeRecorded}`,
          sliceName: sliceVitalSigns
        },
        { status: 404 }
      )
    }
    const validation = await validateTokensAndPet({
      userId: user.id!,
      petId,
      tokenCost: vitalSignsCreateTokenCost,
      actionName: 'vital-signs',
      req,
      user
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create walk record (remove heavy include)
      const newVitalSign = await tx.vitalSigns.create({
        data: {
          bloodPressure,
          capillaryRefillTime,
          heartRate,
          hydrationStatus,
          mucousMembranes,
          notes,
          petId,
          respiratoryRate,
          temperature,
          timeRecorded,
          weight
        }
      })

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          ...(!user.isLegacyUser && { tokens: { decrement: vitalSignsCreateTokenCost } }),
          tokensUsed: { increment: vitalSignsCreateTokenCost }
        }
      })

      // Create token transaction record (simplified metadata)
      await tx.tokenTransaction.create({
        data: {
          userId: user.id!,
          amount: -vitalSignsCreateTokenCost,
          type: user.isLegacyUser ? 'VITAL_SIGNS_CREATION_LEGACY' : 'VITAL_SIGNS_CREATION',
          description: `Vital signs creation${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            walkId: newVitalSign.id,
            feature: 'vital_signs_creation',
            bloodPressure: newVitalSign.bloodPressure,
            capillaryRefillTime: newVitalSign.capillaryRefillTime
          }
        }
      })

      return { walkId: newVitalSign.id, updatedUser }
    })

    const newVitalSignWithPet = await prisma.vitalSigns.findUnique({
      where: { id: result.walkId },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
            age: true,
            weight: true,
            gender: true
          }
        }
      }
    })

    await createLog('info', 'VitalSign created successfully', {
      location: ['api route - POST /api/pet/vital-signs/create'],
      name: 'VitalSignCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      walkId: result.walkId,
      userId: user.id
    })

    return NextResponse.json(
      {
        walk: newVitalSignWithPet,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Vital Signs creation',
      sliceName: slicePet
    })
  } 
}
