import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePainScore } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { painScoreUpdateTokenCost } from '@/app/lib/constants/public/token'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }
    const parameters = await params
    const painScoreId = parameters.painScoreId
    // Validate the pain score ID
    if (!painScoreId) {
      return NextResponse.json({ error: 'Pain score ID is required', sliceName: slicePainScore }, { status: 400 })
    }

    // Parse req body
    const { petId, score, symptoms, location, triggers, relief, timeRecorded, notes } = await req.json()

    const validation = await validateTokensAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: painScoreUpdateTokenCost,
      actionName: 'update pain score',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response!
    }

    // Check if pain score exists
    const existingPainScore = await prisma.painScore.findUnique({
      where: { id: painScoreId },
      include: { pet: true }
    })

    if (!existingPainScore) {
      return NextResponse.json({ error: 'Pain score not found', sliceName: slicePainScore }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (score !== null) updateData.score = +score
    if (symptoms !== null) updateData.symptoms = symptoms
    if (location !== null) updateData.location = location
    if (triggers !== null) updateData.triggers = triggers
    if (relief !== null) updateData.relief = relief
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded
    if (notes !== null) updateData.notes = notes

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update the pain score
      const updatedPainScore = await tx.painScore.update({
        where: { id: painScoreId },
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

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          ...(!userAuth.user.isLegacyUser && { tokens: { decrement: painScoreUpdateTokenCost } }),
          tokensUsed: { increment: painScoreUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -painScoreUpdateTokenCost, // Negative for debit
          type: userAuth.user.isLegacyUser ? 'PAIN_SCORE_UPDATE_LEGACY' : 'PAIN_SCORE_UPDATE',
          description: `Pain score update${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            painScoreId: updatedPainScore.id,
            feature: 'pain_score_update',
            score: updatedPainScore.score,
            symptoms: updatedPainScore.symptoms,
            location: updatedPainScore.location,
            triggers: updatedPainScore.triggers,
            timeRecorded: updatedPainScore.timeRecorded
          }
        }
      })

      return { updatedPainScore, updatedUser }
    })

    await createLog('info', 'Pain score updated successfully', {
      location: ['api route - PATCH /api/pain-scores/[painScoreId]'],
      name: 'PainScoreUpdate',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      id: painScoreId,
      ownerId: userAuth.userId,
      updatedFields: Object.keys(updateData)
    })

    return NextResponse.json({
      sliceName: slicePainScore,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Pain score update',
      sliceName: slicePainScore
    })
  } finally {
    await prisma.$disconnect()
  }
}
