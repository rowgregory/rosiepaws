import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { medicationDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceMedication } from '@/public/data/api.data'
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
    const medicationId = parameters.medicationId

    if (!medicationId) {
      return NextResponse.json({ error: 'Missing medication ID', sliceName: sliceMedication }, { status: 400 })
    }

    // Check if medication exists and belongs to user's pet
    const existingMedication = await prisma.medication.findFirst({
      where: {
        id: medicationId,
        pet: {
          ownerId: userAuth?.userId
        }
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            ownerId: true
          }
        }
      }
    })

    if (!existingMedication) {
      return NextResponse.json(
        { error: 'Medication not found or unauthorized', sliceName: sliceMedication },
        { status: 404 }
      )
    }

    // Store medication info for logging before deletion
    const medicationInfo = {
      id: existingMedication.id,
      drugName: existingMedication.drugName,
      petName: existingMedication.pet.name,
      petId: existingMedication.pet.id
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete medication from database
      const deleletedMedication = await tx.medication.delete({
        where: {
          id: medicationId
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: medicationDeleteTokenCost },
          tokensUsed: { increment: medicationDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -medicationDeleteTokenCost, // Negative for debit
          type: 'MEDICATION_DELETE',
          description: `Medication deleted`,
          metadata: {
            medicationId: deleletedMedication.id,
            feature: 'medication_deleted'
          }
        }
      })

      return { deleletedMedication, updatedUser }
    })

    await createLog('info', 'Medication deleted successfully', {
      location: ['api route - DELETE /api/pet/delete-medication'],
      name: 'MedicationDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      medicationId: medicationInfo.id,
      drugName: medicationInfo.drugName,
      petId: medicationInfo.petId,
      petName: medicationInfo.petName,
      ownerId: userAuth?.userId
    })

    return NextResponse.json({
      sliceName: sliceMedication,
      medication: result.deleletedMedication,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Medication deleted',
      sliceName: sliceMedication
    })
  } finally {
    await prisma.$disconnect()
  }
}
