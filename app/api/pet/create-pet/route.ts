import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { parseStack } from 'error-stack-parser-es/lite'
import { slicePet } from '@/public/data/api.data'
import { createLog } from '@/app/lib/api/createLog'
import { petCreateTokenCost } from '@/app/lib/constants/token'

export async function POST(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const {
      name,
      type,
      breed,
      age,
      gender,
      weight,
      spayedNeutered,
      microchipId,
      allergies,
      emergencyContactName,
      emergencyContactPhone,
      notes
    } = await req.json()

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { message: 'Missing required fields: name and type are required', sliceName: slicePet },
        { status: 400 }
      )
    }

    // Confirm owner exists (optional since user is logged in, but good safety)
    const owner = await prisma.user.findUnique({ where: { id: ownerId } })
    if (!owner) {
      await createLog('warning', 'Owner user not found when creating pet', {
        location: ['api route - POST /api/pet/create-pet'],
        name: 'OwnerNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ownerId
      })
      return NextResponse.json({ message: 'Owner not found', sliceName: slicePet }, { status: 404 })
    }

    // Check if user has enough tokens

    if (owner.tokens < petCreateTokenCost) {
      await createLog('warning', 'Insufficient tokens for pet creation', {
        location: ['api route - POST /api/pet/create-pet'],
        name: 'InsufficientTokens',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ownerId,
        requiredTokens: petCreateTokenCost,
        availableTokens: owner.tokens
      })
      return NextResponse.json(
        {
          message: `Insufficient tokens. Required: ${petCreateTokenCost}, Available: ${owner.tokens}`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create the pet
      const newPet = await tx.pet.create({
        data: {
          name,
          type,
          breed,
          age,
          gender,
          weight,
          ownerId,
          notes,
          spayedNeutered,
          microchipId,
          allergies,
          emergencyContactName,
          emergencyContactPhone
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: ownerId },
        data: {
          tokens: { decrement: petCreateTokenCost },
          tokensUsed: { increment: petCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: ownerId,
          amount: -petCreateTokenCost, // Negative for debit
          type: 'PET_CREATION', // You'll need to add this to your enum
          description: `Pet creation: ${name}`,
          metadata: {
            petId: newPet.id,
            petName: name,
            petType: type,
            feature: 'pet_creation'
          }
        }
      })

      return { newPet, updatedUser }
    })

    await createLog('info', 'Pet created successfully with token deduction', {
      location: ['api route - POST /api/pet/create-pet'],
      name: 'PetCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.newPet.id,
      ownerId,
      tokensDeducted: petCreateTokenCost,
      remainingTokens: result.updatedUser.tokens
    })

    return NextResponse.json(
      {
        pet: result.newPet,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: slicePet
      },
      { status: 201 }
    )
  } catch (error: any) {
    await createLog('error', `Pet creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Pet creation failed', error, sliceName: slicePet }, { status: 500 })
  }
}
