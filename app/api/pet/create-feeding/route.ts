import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePet } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateFeedingRequiredFields } from '@/app/lib/api/validateFeedingRequiredFields'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { feedingCreateTokenCost } from '@/app/lib/constants/public/token'
import { createLog } from '@/app/lib/api/createLog'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
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
      userId: userAuth.userId ?? '',
      petId,
      tokenCost: feedingCreateTokenCost,
      actionName: 'feeding',
      req
    })

    if (!validation.success) {
      return validation.response! // This is the NextResponse with error details
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create PainScore entry
      const newFeeding = await prisma.feeding.create({
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
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: feedingCreateTokenCost },
          tokensUsed: { increment: feedingCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -feedingCreateTokenCost, // Negative for debit
          type: 'FEEDING_CREATION',
          description: `Feeding creation`,
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
      location: ['api route - POST /api/pet/create-feeding'],
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
        feeding: result.newFeeding,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: slicePet
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Feeding creation',
      sliceName: slicePet
    })
  }
}
