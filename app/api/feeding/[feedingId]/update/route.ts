import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceFeeding } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateFeedingRequiredFields } from '@/app/lib/api/validateFeedingRequiredFields'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { feedingUpdateTokenCost } from '@/app/lib/constants/public/token'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const feedingId = parameters.feedingId

    if (!feedingId) {
      return NextResponse.json({ error: 'Feeding ID is required' }, { status: 400 })
    }

    const { petId, foodAmount, foodType, notes, timeRecorded, moodRating, brand, ingredients } = await req.json()

    const validatedFields = validateFeedingRequiredFields({
      petId,
      foodAmount,
      foodType,
      timeRecorded,
      moodRating,
      brand
    })

    if (!validatedFields.success) {
      return validatedFields.response!
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: feedingUpdateTokenCost,
      actionName: 'update feeding',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingFeeding = await prisma.feeding.findUnique({
      where: { id: feedingId },
      include: { pet: true }
    })

    if (!existingFeeding) {
      return NextResponse.json({ error: 'Feeding not found', sliceName: sliceFeeding }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (foodAmount !== null) updateData.foodAmount = foodAmount
    if (foodType !== null) updateData.foodType = foodType
    if (notes !== null) updateData.notes = notes
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded
    if (moodRating !== null) updateData.moodRating = moodRating
    if (brand !== null) updateData.brand = brand
    if (ingredients !== null) updateData.ingredients = ingredients

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const newFeeding = await tx.feeding.update({
        where: { id: feedingId },
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
          tokens: { decrement: feedingUpdateTokenCost },
          tokensUsed: { increment: feedingUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -feedingUpdateTokenCost,
          type: 'FEEDING_UPDATE',
          description: `Feeding update`,
          metadata: {
            ...updateData,
            feature: 'feeding_update'
          }
        }
      })

      return { newFeeding, updatedUser }
    })

    await createLog('info', 'Feeding updated successfully', {
      location: ['api route - POST /api/feeding/[feedingId]/update'],
      name: 'FeedingCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      feedingId: result.newFeeding.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        sliceName: sliceFeeding,
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
      action: 'Feeding updated',
      sliceName: sliceFeeding
    })
  }
}
