import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceBloodSugar } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { bloodSugarUpdateTokenCost } from '@/app/lib/constants/public/token'

export async function PATCH(req: NextRequest, { params }: any) {
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
      return NextResponse.json({ error: 'Blood sugar ID is required' }, { status: 400 })
    }

    const { petId, value, timeRecorded, notes, mealRelation, measurementUnit, targetRange, symptoms, medicationGiven } =
      await req.json()

    if (!petId || !value || !timeRecorded) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, value: ${value}, timeRecorded: ${timeRecorded} are required`,
          sliceName: sliceBloodSugar
        },
        { status: 400 }
      )
    }

    const validation = await validateTokensAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: bloodSugarUpdateTokenCost,
      actionName: 'update blood sugar',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingBloodSugar = await prisma.bloodSugar.findUnique({
      where: { id: bloodSugarId },
      include: { pet: true }
    })

    if (!existingBloodSugar) {
      return NextResponse.json({ error: 'Blood sugar not found', sliceName: sliceBloodSugar }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (value !== null) updateData.value = value
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded
    if (notes !== null) updateData.notes = notes
    if (mealRelation !== null) updateData.mealRelation = mealRelation
    if (measurementUnit !== null) updateData.measurementUnit = measurementUnit
    if (targetRange !== null) updateData.targetRange = targetRange
    if (symptoms !== null) updateData.symptoms = symptoms
    if (medicationGiven !== null) updateData.medicationGiven = medicationGiven

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        const newBloodSugar = await tx.bloodSugar.update({
          where: { id: bloodSugarId },
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

        const updatedUser = await tx.user.update({
          where: { id: userAuth.userId },
          data: {
            ...(!userAuth.user.isLegacyUser && { tokens: { decrement: bloodSugarUpdateTokenCost } }),
            tokensUsed: { increment: bloodSugarUpdateTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: userAuth.userId!,
            amount: -bloodSugarUpdateTokenCost,
            type: userAuth.user.isLegacyUser ? 'BLOOD_SUGAR_UPDATE_LEGACY' : 'BLOOD_SUGAR_UPDATE',
            description: `Blood sugar update${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              ...updateData,
              feature: 'blood_sugar_update'
            }
          }
        })

        return { newBloodSugar, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Blood sugar updated successfully', {
      location: ['api route - POST /api/bloodSugar/[bloodSugarId]/update'],
      name: 'BloodSugarUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      bloodSugarId: result.newBloodSugar.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        bloodSugar: result.newBloodSugar,
        sliceName: sliceBloodSugar,
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
      action: 'Blood sugar updated',
      sliceName: sliceBloodSugar
    })
  }
}
