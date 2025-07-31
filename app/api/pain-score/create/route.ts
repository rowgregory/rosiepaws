import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePainScore } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validatePainScoreRequiredFields } from '@/app/lib/api/validatePainScoreRequiredFields'
import { painScoreCreateTokenCost } from '@/app/lib/constants/public/token'
import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const { petId, score, timeRecorded, symptoms, location, triggers, relief, notes } = await req.json()

    const validatedFields = validatePainScoreRequiredFields({
      petId,
      score,
      timeRecorded
    })

    if (!validatedFields.success) {
      return validatedFields.response!
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: painScoreCreateTokenCost,
      actionName: 'pain score',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create PainScore entry
      const newPainScore = await tx.painScore.create({
        data: {
          petId,
          score: Number(score),
          timeRecorded: new Date(timeRecorded),
          symptoms,
          location,
          triggers,
          relief,
          notes
        },
        include: {
          pet: true
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: painScoreCreateTokenCost },
          tokensUsed: { increment: painScoreCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -painScoreCreateTokenCost,
          type: 'PAIN_SCORE_CREATION',
          description: `Pain score creation`,
          metadata: {
            painScoreId: newPainScore.id,
            painScore: newPainScore.score,
            feature: 'pain_score_creation'
          }
        }
      })

      return { newPainScore, updatedUser }
    })

    await createLog('info', 'Pain score created successfully', {
      location: ['api route - POST /api/pain-score/create'],
      name: 'PainScoreCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      painScoreId: result.newPainScore.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        sliceName: slicePainScore,
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
      action: 'Pain score creation',
      sliceName: slicePainScore
    })
  } finally {
    await prisma.$disconnect()
  }
}
