import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceFeeding } from '@/public/data/api.data'
import { validateFeedingRequiredFields } from '@/app/lib/api/validateFeedingRequiredFields'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { feedingUpdateTokenCost } from '@/app/lib/constants/public/token'
import { requireAuth } from '@/app/lib/auth/getServerSession'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const {user} = await requireAuth();

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

    const validation = await validateTokensAndPet({
      userId: user.id!,
      petId,
      tokenCost: feedingUpdateTokenCost,
      actionName: 'update feeding',
      req,
      user
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
        where: { id: user.id },
        data: {
          ...(!user.isLegacyUser && { tokens: { decrement: feedingUpdateTokenCost } }),
          tokensUsed: { increment: feedingUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: user.id!,
          amount: -feedingUpdateTokenCost,
          type: user.isLegacyUser ? 'FEEDING_UPDATE_LEGACY' : 'FEEDING_UPDATE',
          description: `Feeding update${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
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
      userId: user.id
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
