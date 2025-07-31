import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceWater } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { waterUpdateTokenCost } from '@/app/lib/constants/public/token'
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
    const waterId = parameters.waterId
    // Validate the water ID
    if (!waterId) {
      return NextResponse.json({ error: 'Water ID is required', sliceName: sliceWater }, { status: 400 })
    }

    // Parse req body
    const { petId, milliliters, timeRecorded, moodRating, notes } = await req.json()

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: waterUpdateTokenCost,
      actionName: 'update water',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    // Check if water exists
    const existingPainScore = await prisma.water.findUnique({
      where: { id: waterId },
      include: { pet: true }
    })

    if (!existingPainScore) {
      return NextResponse.json({ error: 'Water not found', sliceName: sliceWater }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (milliliters !== null) updateData.milliliters = milliliters
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded
    if (moodRating !== null) updateData.moodRating = moodRating
    if (notes !== null) updateData.notes = notes

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update the water
      const updatedWater = await tx.water.update({
        where: { id: waterId },
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
          tokens: { decrement: waterUpdateTokenCost },
          tokensUsed: { increment: waterUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -waterUpdateTokenCost, // Negative for debit
          type: 'WATER_UPDATE',
          description: `Water update`,
          metadata: {
            feature: 'water_update',
            ...Object.keys(updateData)
          }
        }
      })

      return { updatedWater, updatedUser }
    })

    await createLog('info', 'Water updated successfully', {
      location: ['api route - PATCH /api/water/[waterId]/update'],
      name: 'WaterUpdate',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      id: waterId,
      ownerId: userAuth.userId,
      updatedFields: Object.keys(updateData)
    })

    return NextResponse.json({
      sliceName: sliceWater,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Water update',
      sliceName: sliceWater
    })
  } finally {
    await prisma.$disconnect()
  }
}
