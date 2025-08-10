import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceWater } from '@/public/data/api.data'
import { waterCreateTokenCost } from '@/app/lib/constants/public/token'
import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const { petId, milliliters, timeRecorded, moodRating, notes } = await req.json()

    if (!petId || !timeRecorded || moodRating < 0 || moodRating > 4) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, milliliters: ${milliliters}, timeRecorded: ${timeRecorded}, and moodRading: ${moodRating} are required`,
          sliceName: sliceWater
        },
        { status: 400 }
      )
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: waterCreateTokenCost,
      actionName: 'pain score',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create water entry
      const newWater = await tx.water.create({
        data: {
          petId,
          milliliters,
          timeRecorded,
          moodRating,
          notes
        },
        include: {
          pet: true // Optional: attach pet info like name
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: waterCreateTokenCost },
          tokensUsed: { increment: waterCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -waterCreateTokenCost, // Negative for debit
          type: 'WATER_CREATION',
          description: `Water creation`,
          metadata: {
            waterId: newWater.id,
            feature: 'water_creation',
            milliliters: newWater.milliliters
          }
        }
      })

      return { newWater, updatedUser }
    })

    await createLog('info', 'Water created successfully', {
      location: ['api route - POST /api/water/create'],
      name: 'WaterCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      waterId: result.newWater.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        water: result.newWater,
        sliceName: sliceWater,
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
      action: 'Water creation',
      sliceName: sliceWater
    })
  } finally {
    await prisma.$disconnect()
  }
}
