import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { waterDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceWater } from '@/public/data/api.data'
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
    const waterId = parameters.waterId

    if (!waterId) {
      return NextResponse.json({ error: 'Water ID is required', sliceNam: sliceWater }, { status: 400 })
    }

    // Check if water exists
    const existingWater = await prisma.water.findUnique({
      where: { id: waterId }
    })

    if (!existingWater) {
      return NextResponse.json({ error: 'Water not found', sliceNam: sliceWater }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete the water
      const deletedWater = await tx.water.delete({
        where: { id: waterId },
        select: { id: true, milliliters: true, timeRecorded: true, pet: true }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: waterDeleteTokenCost },
          tokensUsed: { increment: waterDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -waterDeleteTokenCost, // Negative for debit
          type: 'WATER_DELETE',
          description: `Water delete`,
          metadata: {
            petId: deletedWater.pet.id,
            waterId: deletedWater.id,
            feature: 'delete',
            milliliters: deletedWater.milliliters,
            timeRecorded: deletedWater.timeRecorded
          }
        }
      })

      return { deletedWater, updatedUser }
    })

    await createLog('info', 'Water deleted successfully', {
      location: ['api route - POST /api/water/[waterId]/delete'],
      name: 'WaterDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedWater.pet.id,
      waterId: result.deletedWater.id,
      userId: userAuth.userId
    })

    return NextResponse.json({
      sliceNam: sliceWater,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Water delete',
      sliceName: sliceWater
    })
  }
}
