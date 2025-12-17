import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceFeeding } from '@/public/data/api.data'
import { validateFeedingRequiredFields } from '@/app/lib/api/validateFeedingRequiredFields'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { feedingCreateTokenCost } from '@/app/lib/constants/public/token'
import { createLog } from '@/app/lib/api/createLog'
import { requireAuth } from '@/app/lib/auth/getServerSession'

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();

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
      tokenCost: feedingCreateTokenCost,
      actionName: 'feeding',
      req,
      user
    })

    if (!validation.success) {
      return validation.response! // This is the NextResponse with error details
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create PainScore entry
      const newFeeding = await tx.feeding.create({
        data: {
          petId,
          foodAmount,
          foodType,
          notes,
          timeRecorded,
          moodRating,
          ingredients,
          brand
        },
        include: {
          pet: true // Optional: attach pet info like name
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          ...(!user.isLegacyUser && { tokens: { decrement: feedingCreateTokenCost } }),
          tokensUsed: { increment: feedingCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: user.id!,
          amount: -feedingCreateTokenCost, // Negative for debit
          type: user.isLegacyUser ? 'FEEDING_CREATION_LEGACY' : 'FEEDING_CREATION',
          description: `Feeding creation${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            feedingId: newFeeding.id,
            foodAmount: newFeeding.foodAmount,
            foodType: newFeeding.foodType,
            feature: 'feeding_creation'
          }
        }
      })

      return { newFeeding, updatedUser }
    })

    await createLog('info', 'Feeding created successfully', {
      location: ['api route - POST /api/feeding/create'],
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
        feeding: result.newFeeding,
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
      action: 'Feeding creation',
      sliceName: sliceFeeding
    })
  }
}
