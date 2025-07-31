import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { walkDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceWalk } from '@/public/data/api.data'
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
    const walkId = parameters.walkId

    if (!walkId) {
      return NextResponse.json({ error: 'Walk ID is required', sliceNam: sliceWalk }, { status: 400 })
    }

    // Check if walk exists
    const existingWalk = await prisma.walk.findUnique({
      where: { id: walkId }
    })

    if (!existingWalk) {
      return NextResponse.json({ error: 'Walk not found', sliceNam: sliceWalk }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete the walk
      const deletedWalk = await tx.walk.delete({
        where: { id: walkId },
        select: { id: true, timeRecorded: true, pet: true }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: walkDeleteTokenCost },
          tokensUsed: { increment: walkDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -walkDeleteTokenCost, // Negative for debit
          type: 'WALK_DELETE',
          description: `Walk delete`,
          metadata: {
            petId: deletedWalk.pet.id,
            walkId: deletedWalk.id,
            feature: 'delete',
            timeRecorded: deletedWalk.timeRecorded
          }
        }
      })

      return { deletedWalk, updatedUser }
    })

    await createLog('info', 'Walk deleted successfully', {
      location: ['api route - POST /api/walk/[walkId]/delete'],
      name: 'WalkDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedWalk.pet.id,
      walkId: result.deletedWalk.id,
      userId: userAuth.userId
    })

    return NextResponse.json({
      sliceNam: sliceWalk
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Walk delete',
      sliceName: sliceWalk
    })
  }
}
