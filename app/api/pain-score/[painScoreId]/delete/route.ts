import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { painScoreDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { slicePainScore } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const painScoreId = parameters.painScoreId

    if (!painScoreId) {
      return NextResponse.json({ error: 'Pain score ID is required', sliceNam: slicePainScore }, { status: 400 })
    }

    // Check if pain score exists
    const existingPainScore = await prisma.painScore.findUnique({
      where: { id: painScoreId }
    })

    if (!existingPainScore) {
      return NextResponse.json({ error: 'Pain score not found', sliceNam: slicePainScore }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete the pain score
      const deletedPainScore = await tx.painScore.delete({
        where: { id: painScoreId },
        select: { id: true, score: true, timeRecorded: true, pet: true }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          ...(!userAuth.user.isLegacyUser && { tokens: { decrement: painScoreDeleteTokenCost } }),
          tokensUsed: { increment: painScoreDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -painScoreDeleteTokenCost, // Negative for debit
          type: userAuth.user.isLegacyUser ? 'PAIN_SCORE_DELETE_LEGACY' : 'PAIN_SCORE_DELETE',
          description: `Pet score delete${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            petId: deletedPainScore.id,
            feature: 'delete',
            score: deletedPainScore.score,
            timeRecorded: deletedPainScore.timeRecorded
          }
        }
      })

      return { deletedPainScore, updatedUser }
    })

    await createLog('info', 'Pain score deleted successfully', {
      location: ['api route - POST /api/pain-scores/[painScoreId]/delete'],
      name: 'PainScoreDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedPainScore.pet.id,
      painScoreId: result.deletedPainScore.id,
      userId: userAuth.userId
    })

    return NextResponse.json({
      sliceNam: slicePainScore,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Pain score delete',
      sliceName: slicePainScore
    })
  } finally {
    await prisma.$disconnect()
  }
}
