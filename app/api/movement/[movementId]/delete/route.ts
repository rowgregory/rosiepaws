import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { movementDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceMovement } from '@/public/data/api.data'
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
    const movementId = parameters.movementId

    if (!movementId) {
      return NextResponse.json({ error: 'Movement ID is required', sliceName: sliceMovement }, { status: 400 })
    }

    // Check if movement exists
    const existingMovement = await prisma.movement.findUnique({
      where: { id: movementId }
    })

    if (!existingMovement) {
      return NextResponse.json({ error: 'Movement not found', sliceName: sliceMovement }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete the movement
      const deletedMovement = await tx.movement.delete({
        where: { id: movementId },
        select: { id: true, durationMinutes: true, activityLevel: true, timeRecorded: true, pet: true }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: movementDeleteTokenCost },
          tokensUsed: { increment: movementDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -movementDeleteTokenCost, // Negative for debit
          type: 'MOVEMENT_DELETE',
          description: `Movement delete`,
          metadata: {
            petId: deletedMovement.id,
            feature: 'movement_delete',
            activityLevel: deletedMovement.activityLevel,
            timeRecorded: deletedMovement.timeRecorded
          }
        }
      })

      return { deletedMovement, updatedUser }
    })

    await createLog('info', 'Movement deleted successfully', {
      location: ['api route - POST /api/pain-scores/[movementId]/delete'],
      name: 'MovementDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedMovement.pet.id,
      movementId: result.deletedMovement.id,
      userId: userAuth.userId
    })

    return NextResponse.json({
      sliceName: sliceMovement,
      movement: result.deletedMovement,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Movement delete',
      sliceName: sliceMovement
    })
  } finally {
    await prisma.$disconnect()
  }
}
