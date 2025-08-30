import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceBloodSugar } from '@/public/data/api.data'
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
    const bloodSugarId = parameters.bloodSugarId

    if (!bloodSugarId) {
      return NextResponse.json({ error: 'Blood sugar ID is required', sliceName: sliceBloodSugar }, { status: 400 })
    }

    // Check if bloodSugar exists
    const existingBloodSugar = await prisma.bloodSugar.findUnique({
      where: { id: bloodSugarId }
    })

    if (!existingBloodSugar) {
      return NextResponse.json({ error: 'Blood sugar not found', sliceName: sliceBloodSugar }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Delete the bloodSugar
        const deletedBloodSugar = await tx.bloodSugar.delete({
          where: { id: bloodSugarId },
          select: {
            id: true,
            value: true,
            timeRecorded: true,
            mealRelation: true,
            measurementUnit: true,
            symptoms: true,
            targetRange: true,
            pet: {
              select: {
                id: true
              }
            }
          }
        })

        // Deduct tokens from user
        const updatedUser = await tx.user.update({
          where: { id: userAuth.userId },
          data: {
            ...(!userAuth.user.isLegacyUser && { tokens: { decrement: 0 } }),
            tokensUsed: { increment: 0 }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: userAuth.userId!,
            amount: 0, // Negative for debit
            type: userAuth.user.isLegacyUser ? 'BLOOD_SUGAR_DELETE_LEGACY' : 'BLOOD_SUGAR_DELETE',
            description: `Blood sugar delete${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              petId: deletedBloodSugar.id,
              feature: 'blood_sugar_delete',
              value: deletedBloodSugar.value,
              timeRecorded: deletedBloodSugar.timeRecorded,
              mealRelation: deletedBloodSugar.mealRelation,
              measurementUnit: deletedBloodSugar.measurementUnit,
              targetRange: deletedBloodSugar.targetRange
            }
          }
        })

        return { deletedBloodSugar, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Blood sugar deleted successfully', {
      location: ['api route - POST /api/bloodSugar/[bloodSugarId]/delete'],
      name: 'BloodSugarDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedBloodSugar.pet.id,
      bloodSugarId: result.deletedBloodSugar.id,
      userId: userAuth.userId
    })

    return NextResponse.json({
      bloodSugar: result.deletedBloodSugar,
      sliceName: sliceBloodSugar,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Blood sugar deleted',
      sliceName: sliceBloodSugar
    })
  }
}
