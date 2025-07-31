import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceWalk } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateWalkRequiredFields } from '@/app/lib/api/validateWalkRequiredFields'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { walkUpdateTokenCost } from '@/app/lib/constants/public/token'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const walkId = parameters.walkId

    if (!walkId) {
      return NextResponse.json({ error: 'Walk ID is required' }, { status: 400 })
    }

    const { petId, distance, duration, pace, distraction, timeRecorded, moodRating, notes } = await req.json()

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
      userId: userAuth.userId!,
      petId,
      tokenCost: walkUpdateTokenCost,
      actionName: 'update walk',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingWalk = await prisma.walk.findUnique({
      where: { id: walkId },
      include: { pet: true }
    })

    if (!existingWalk) {
      return NextResponse.json({ error: 'Walk not found', sliceName: sliceWalk }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (distance !== null) updateData.distance = distance
    if (duration !== null) updateData.duration = duration
    if (pace !== null) updateData.pace = pace
    if (distraction !== null) updateData.distraction = distraction
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded
    if (moodRating !== null) updateData.moodRating = moodRating
    if (notes !== null) updateData.notes = notes

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const newWalk = await tx.walk.update({
        where: { id: walkId },
        data: updateData,
        include: {
          pet: {
            select: {
              id: true,
              name: true,
              type: true,
              breed: true
            }
          }
        }
      })

      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: walkUpdateTokenCost },
          tokensUsed: { increment: walkUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -walkUpdateTokenCost,
          type: 'WALK_UPDATE',
          description: `Walk update`,
          metadata: {
            ...updateData,
            feature: 'walk_update'
          }
        }
      })

      return { newWalk, updatedUser }
    })

    await createLog('info', 'Walk updated successfully', {
      location: ['api route - POST /api/walk/[walkId]/update'],
      name: 'WalkCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      walkId: result.newWalk.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        sliceName: sliceWalk,
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
      action: 'Walk updated',
      sliceName: sliceWalk
    })
  }
}
