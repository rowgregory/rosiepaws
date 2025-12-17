import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePet } from '@/public/data/api.data'
import { createLog } from '@/app/lib/api/createLog'
import { petCreateTokenCost } from '@/app/lib/constants/public/token'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'

export async function POST(req: NextRequest) {
  try {
    const {user} = await requireAuth();

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
      notes,
      fileName,
      filePath
    } = await req.json()

    if (!name || !type || !breed || !age || !weight || !gender || !spayedNeutered) {
      return NextResponse.json(
        {
          message: `Missing required fields: name:${name}, type:${type}, breed:${breed}, age:${age}, weight:${weight}, gender:${gender}, and spayedNeutered:${spayedNeutered} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Confirm owner exists (optional since user is logged in, but good safety)
    const owner = await prisma.user.findUnique({ where: { id: user.id } })
    if (!owner) {
      await createLog('warning', 'Owner user not found when creating pet', {
        location: ['api route - POST /api/pet/create'],
        name: 'OwnerNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        userId: user.id
      })
      return NextResponse.json({ message: 'Owner not found', sliceName: slicePet }, { status: 404 })
    }

    // Check if user has enough tokens
    if (!owner?.isLegacyUser && owner?.tokens < petCreateTokenCost) {
      await createLog('warning', 'Insufficient tokens for pet creation', {
        location: ['api route - POST /api/pet/create'],
        name: 'InsufficientTokens',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        userId: user.id,
        requiredTokens: petCreateTokenCost,
        availableTokens: owner?.tokens
      })
      return NextResponse.json(
        {
          message: `Insufficient tokens. Required: ${petCreateTokenCost}, Available: ${owner?.tokens}`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Prepare final pet data with media URL
        const finalPetData = {
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
          notes,
          ownerId: user.id!,
          ...(fileName && filePath && { filePath, fileName })
        }

        const newPet = await tx.pet.create({
          data: finalPetData
        })

        // Deduct tokens from user
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            ...(!owner?.isLegacyUser && { tokens: { decrement: petCreateTokenCost } }),
            tokensUsed: { increment: petCreateTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: user.id!,
            amount: -petCreateTokenCost, // Negative for debit
            type: owner?.isLegacyUser ? 'PET_CREATION_LEGACY' : 'PET_CREATION',
            description: `Pet creation${owner?.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              petId: newPet.id,
              petName: name,
              petType: type,
              feature: 'pet_creation'
            }
          }
        })

        return { newPet, updatedUser }
      },
      {
        timeout: 20000
      }
    )

    await createLog('info', 'Pet created successfully with token deduction', {
      location: ['api route - POST /api/pet/create-pet'],
      name: 'PetCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.newPet.id,
      ownerId: user.id,
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
    return await handleApiError({
      error,
      req,
      action: 'Pet creation',
      sliceName: slicePet
    })
  }
}
