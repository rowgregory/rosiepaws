import { walkCreateTokenCost } from '@/app/lib/constants/token'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateWalkRequiredFields } from '@/app/lib/api/validateWalkRequiredFields'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'

interface CreateWalkRequest {
  petId: string
  distance: string
  duration: string
  pace: string
  distraction: string
  timeRecorded: string
  moodRating: number
  notes?: string
}

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const { petId, distance, duration, pace, distraction, timeRecorded, moodRating, notes }: CreateWalkRequest =
      await req.json()

    const validatedFields = validateWalkRequiredFields({
      petId,
      distance,
      duration,
      pace,
      distraction,
      timeRecorded,
      moodRating
    })

    if (!validatedFields.success) {
      return validatedFields.response!
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId ?? '',
      petId,
      tokenCost: walkCreateTokenCost,
      actionName: 'walk',
      req
    })

    if (!validation.success) {
      return validation.response! // This is the NextResponse with error details
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create walk record (remove heavy include)
      const newWalk = await tx.walk.create({
        data: {
          petId,
          distance,
          duration,
          pace,
          distraction,
          timeRecorded,
          moodRating: Number(moodRating),
          notes
        }
      })

      // Deduct tokens from user (only update tokens)
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: walkCreateTokenCost },
          tokensUsed: { increment: walkCreateTokenCost }
        }
      })

      // Create token transaction record (simplified metadata)
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -walkCreateTokenCost,
          type: 'WALK_CREATION',
          description: `Walk creation`,
          metadata: {
            walkId: newWalk.id,
            feature: 'walk_creation'
          }
        }
      })

      return { walkId: newWalk.id, updatedUser }
    })

    const newWalkWithPet = await prisma.walk.findUnique({
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

    await createLog('info', 'Walk created successfully', {
      location: ['api route - POST /api/pet/create-walk'],
      name: 'WalkCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      walkId: result.walkId,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        walk: newWalkWithPet,
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
      action: 'Walk creation',
      sliceName: slicePet
    })
  } finally {
    await prisma.$disconnect()
  }
}
