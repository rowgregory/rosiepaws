import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { parseStack } from 'error-stack-parser-es/lite'
import { slicePet } from '@/public/data/api.data'
import { waterCreateTokenCost } from '@/app/lib/constants/public/token'
import { createLog } from '@/app/lib/api/createLog'

export async function POST(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const { petId, milliliters, timeRecorded, moodRating, notes } = await req.json()

    if (!petId || !timeRecorded || !moodRating) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, milliliters: ${milliliters}, timeRecorded: ${timeRecorded}, and moodRading: ${moodRating} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Confirm owner exists (optional since user is logged in, but good safety)
    const owner = await prisma.user.findUnique({ where: { id: ownerId } })
    if (!owner) {
      await createLog('warning', 'Owner user not found when creating water log', {
        location: ['api route - POST /api/pet/create-water'],
        name: 'OwnerNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ownerId
      })
      return NextResponse.json({ message: 'Owner not found', sliceName: slicePet }, { status: 404 })
    }

    if (owner.tokens < waterCreateTokenCost) {
      await createLog('warning', 'Insufficient tokens for water creation', {
        location: ['api route - POST /api/pet/create-water'],
        name: 'InsufficientTokens',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ownerId,
        requiredTokens: waterCreateTokenCost,
        availableTokens: owner.tokens
      })
      return NextResponse.json(
        {
          message: `Insufficient tokens. Required: ${waterCreateTokenCost}, Available: ${owner.tokens}`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Confirm pet exists
    const pet = await prisma.pet.findUnique({ where: { id: petId } })
    if (!pet) {
      await createLog('warning', 'Pet not found when creating water', {
        location: ['api route - POST /api/pet/create-water'],
        name: 'PetNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        petId,
        ownerId
      })
      return NextResponse.json({ message: 'Pet not found', sliceName: slicePet }, { status: 404 })
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
        where: { id: ownerId },
        data: {
          tokens: { decrement: waterCreateTokenCost },
          tokensUsed: { increment: waterCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: ownerId,
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
      location: ['api route - POST /api/pet/create-water'],
      name: 'WaterCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      waterId: result.newWater.id,
      ownerId
    })

    return NextResponse.json(
      {
        water: result.newWater,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: slicePet
      },
      { status: 201 }
    )
  } catch (error: any) {
    await createLog('error', `Water creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Water creation failed', error, sliceName: slicePet }, { status: 500 })
  }
}
