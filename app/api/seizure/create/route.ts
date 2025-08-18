import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { seizureCreateTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceSeizure } from '@/public/data/api.data'
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
          sliceName: sliceSeizure
        },
        { status: 400 }
      )
    }

    const validation = await validateTokensAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: seizureCreateTokenCost,
      actionName: 'seizure',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Convert duration from minutes to seconds for database storage

      // Create seizure record
      const newSeizure = await tx.seizure.create({
        data: {
          petId,
          duration,
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
          ...(!userAuth.user.isLegacyUser && { tokens: { decrement: seizureCreateTokenCost } }),
          tokensUsed: { increment: seizureCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -seizureCreateTokenCost, // Negative for debit
          type: userAuth.user.isLegacyUser ? 'SEIZURE_TRACKING_CREATION_LEGACY' : 'SEIZURE_TRACKING_CREATION',
          description: `Seizure tracking creation${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
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
        },
        sliceName: sliceSeizure
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Seizure creation',
      sliceName: sliceSeizure
    })
  } finally {
    await prisma.$disconnect()
  }
}
