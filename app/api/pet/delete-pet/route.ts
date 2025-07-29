import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePet } from '@/public/data/api.data'
import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { petDeleteTokenCost } from '@/app/lib/constants/public/token'
import { handleApiError } from '@/app/lib/api/handleApiError'

export async function DELETE(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const { petId } = await req.json()

    if (!petId) {
      return NextResponse.json(
        { message: 'Missing required field: pet id is required for deletion', sliceName: slicePet },
        { status: 400 }
      )
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId ?? '',
      petId,
      tokenCost: petDeleteTokenCost,
      actionName: 'delete pet',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    // Get pet details before deletion for logging
    const petToDelete = await prisma.pet.findUnique({
      where: { id: petId },
      select: {
        id: true,
        name: true,
        type: true,
        _count: {
          select: {
            painScores: true,
            feedings: true,
            waters: true,
            walks: true,
            movements: true,
            appointments: true,
            medications: true,
            bloodSugars: true,
            seizures: true,
            galleryItems: true
          }
        }
      }
    })

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete the pet (cascade will handle related records)
      const deletedPet = await tx.pet.delete({
        where: { id: petId }
      })

      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: petDeleteTokenCost },
          tokensUsed: { increment: petDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -petDeleteTokenCost, // Negative for debit
          type: 'PET_DELETE',
          description: `Pet deletion`,
          metadata: {
            petId: deletedPet.id,
            petName: deletedPet.name,
            petType: deletedPet.type,
            feature: 'pet_delete'
          }
        }
      })

      return { deletedPet, updatedUser }
    })

    await createLog('info', 'Pet deleted successfully with all related records', {
      location: ['api route - DELETE /api/pet/delete-pet'],
      name: 'PetDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedPet.id,
      petName: result.deletedPet.name,
      petType: result.deletedPet.type,
      userId: userAuth.userId,
      relatedRecordsDeleted: {
        painScores: petToDelete?._count.painScores || 0,
        feedings: petToDelete?._count.feedings || 0,
        waters: petToDelete?._count.waters || 0,
        walks: petToDelete?._count.walks || 0,
        movements: petToDelete?._count.movements || 0,
        appointments: petToDelete?._count.appointments || 0,
        medications: petToDelete?._count.medications || 0,
        bloodSugars: petToDelete?._count.bloodSugars || 0,
        seizures: petToDelete?._count.seizures || 0
      }
    })

    return NextResponse.json(
      {
        message: `Pet "${result.deletedPet.name}" and all related records deleted successfully`,
        deletedPet: {
          id: result.deletedPet.id,
          name: result.deletedPet.name,
          type: result.deletedPet.type
        },
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
      action: 'Pet deletion',
      sliceName: slicePet
    })
  } finally {
    await prisma.$disconnect()
  }
}
