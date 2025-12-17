import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import { feedingDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceFeeding } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const {user} = await requireAuth();

    const parameters = await params
    const feedingId = parameters.feedingId

    if (!feedingId) {
      return NextResponse.json({ error: 'Feeding ID is required', sliceName: sliceFeeding }, { status: 400 })
    }

    // Check if feeding exists
    const existingFeeding = await prisma.feeding.findUnique({
      where: { id: feedingId }
    })

    if (!existingFeeding) {
      return NextResponse.json({ error: 'Feeding not found', sliceName: sliceFeeding }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete the feeding
      const deletedFeeding = await tx.feeding.delete({
        where: { id: feedingId },
        select: {
          id: true,
          foodAmount: true,
          foodType: true,
          timeRecorded: true,
          pet: {
            select: {
              id: true
            }
          }
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          ...(!user.isLegacyUser && { tokens: { decrement: feedingDeleteTokenCost } }),
          tokensUsed: { increment: feedingDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: user.id!,
          amount: -feedingDeleteTokenCost, // Negative for debit
          type: user.isLegacyUser ? 'FEEDING_DELETE_LEGACY' : 'FEEDING_CREATION',
          description: `Feeding delete${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            petId: deletedFeeding.id,
            feature: 'delete',
            foodType: deletedFeeding.foodType,
            foodAmount: deletedFeeding.foodAmount,
            timeRecorded: deletedFeeding.timeRecorded
          }
        }
      })

      return { deletedFeeding, updatedUser }
    })

    await createLog('info', 'Feeding deleted successfully', {
      location: ['api route - POST /api/feeding/[feedingId]/delete'],
      name: 'FeedingDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedFeeding.pet.id,
      feedingId: result.deletedFeeding.id,
      userId: user.id
    })

    return NextResponse.json({
      deletedFeeding: result.deletedFeeding,
      sliceName: sliceFeeding,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Feeding deleted',
      sliceName: sliceFeeding
    })
  }
}
