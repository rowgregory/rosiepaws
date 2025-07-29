import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePet } from '@/public/data/api.data'
import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { petUpdateTokenCost } from '@/app/lib/constants/public/token'
import { handleApiError } from '@/app/lib/api/handleApiError'

export async function PUT(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const {
      id,
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
    if (!id || !name || !type) {
      return NextResponse.json(
        { message: 'Missing required field: pet id is required for update', sliceName: slicePet },
        { status: 400 }
      )
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId ?? '',
      petId: id,
      tokenCost: petUpdateTokenCost,
      actionName: 'update pet',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update the pet
      const updatedPet = await prisma.pet.update({
        where: { id },
        data: {
          name,
          type,
          breed,
          age,
          gender,
          weight,
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
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: petUpdateTokenCost },
          tokensUsed: { increment: petUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -petUpdateTokenCost, // Negative for debit
          type: 'PET_UPDATE',
          description: `Pet update`,
          metadata: {
            petId: updatedPet.id,
            feature: 'pet_update',
            petName: updatedPet.name,
            petBreed: updatedPet.breed
          }
        }
      })

      return { updatedPet, updatedUser }
    })

    await createLog('info', 'Pet updated successfully', {
      location: ['api route - PUT /api/pet/update-pet'],
      name: 'PetUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.updatedPet.id,
      petName: result.updatedPet.name,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        pet: result.updatedPet,
        sliceName: slicePet,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        }
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
  } finally {
    await prisma.$disconnect()
  }
}
