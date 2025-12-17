import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePet } from '@/public/data/api.data'
import { createLog } from '@/app/lib/api/createLog'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { petUpdateTokenCost } from '@/app/lib/constants/public/token'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const {user} = await requireAuth();

    const parameters = await params
    const petId = parameters.petId

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
          message: `Missing required fields: name:${name}, type:${type}, breed:${breed}, age:${age}, weight:${weight}, gender:${gender}, and sprayedNeutered:${spayedNeutered} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    const validation = await validateTokensAndPet({
      userId: user.id!,
      petId,
      tokenCost: petUpdateTokenCost,
      actionName: 'update pet',
      req,
      user
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        const updatedPet = await tx.pet.update({
          where: { id: petId },
          data: {
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
          }
        })

        // Deduct tokens from user
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            ...(!user.isLegacyUser && { tokens: { decrement: petUpdateTokenCost } }),
            tokensUsed: { increment: petUpdateTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: user.id!,
            amount: -petUpdateTokenCost, // Negative for debit
            type: user.isLegacyUser ? 'PET_UPDATE_LEGACY' : 'PET_UPDATE',
            description: `Pet update${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              petId: updatedPet.id,
              feature: 'pet_update',
              petName: updatedPet.name,
              petBreed: updatedPet.breed
            }
          }
        })

        return { updatedPet, updatedUser }
      },
      {
        timeout: 20000
      }
    )

    await createLog('info', 'Pet updated successfully', {
      location: ['api route - PUT /api/pet/[petId]/update'],
      name: 'PetUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.updatedPet.id,
      petName: result.updatedPet.name,
      userId: user.id
    })

    return NextResponse.json(
      {
        pet: result.updatedPet,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: slicePet
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Pet update',
      sliceName: slicePet
    })
  }
}
