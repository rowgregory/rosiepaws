import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { seizureCreateTokenCost } from '@/app/lib/constants/token'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

interface CreateSeizureRequest {
  petId: string
  timeRecorded: string
  duration: number
  notes?: string
  videoUrl?: string
  videoFilename?: string
  seizureType?: 'GENERALIZED' | 'FOCAL' | 'ABSENCE' | 'MYOCLONIC' | 'TONIC_CLONIC' | 'ATONIC' | 'UNKNOWN'
  severity?: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
  triggerFactor?: string
  recoveryTime?: number
}

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const {
      petId,
      timeRecorded,
      duration,
      notes,
      videoUrl,
      videoFilename,
      seizureType,
      severity,
      triggerFactor,
      recoveryTime
    }: CreateSeizureRequest = await req.json()

    if (!petId || !timeRecorded || !duration) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, timeRecorded: ${timeRecorded}, and duration: ${duration} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId ?? '',
      petId,
      tokenCost: seizureCreateTokenCost,
      actionName: 'seizure',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Convert duration from minutes to seconds for database storage
      const durationInSeconds = duration ? Math.round(duration * 60) : 0

      // Create seizure record
      const newSeizure = await tx.seizure.create({
        data: {
          petId,
          duration: durationInSeconds,
          timeRecorded,
          notes: notes || null,
          videoUrl: videoUrl || null,
          videoFilename: videoFilename || null,
          seizureType: seizureType,
          severity,
          triggerFactor,
          recoveryTime
        },
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

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: seizureCreateTokenCost },
          tokensUsed: { increment: seizureCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -seizureCreateTokenCost, // Negative for debit
          type: 'SEIZURE_TRACKING_CREATION',
          description: `Seizure creation`,
          metadata: {
            seizureId: newSeizure.id,
            feature: 'seizure_creation'
          }
        }
      })

      return { newSeizure, updatedUser }
    })

    // Convert duration back to minutes for response
    await createLog('info', 'Seizure created successfully', {
      location: ['api route - POST /api/pet/create-seizure'],
      name: 'SeizureCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      seizureId: result.newSeizure.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        seizure: result.newSeizure,
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
      action: 'Seizure creation',
      sliceName: slicePet
    })
  } finally {
    await prisma.$disconnect()
  }
}
