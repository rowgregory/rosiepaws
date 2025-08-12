import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceVitalSigns } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { vitalSignsUpdateTokenCost } from '@/app/lib/constants/public/token'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const vitalSignsId = parameters.vitalSignsId

    if (!vitalSignsId) {
      return NextResponse.json({ error: 'Vital Signs ID is required' }, { status: 400 })
    }

    const {
      petId,
      bloodPressure,
      capillaryRefillTime,
      heartRate,
      hydrationStatus,
      mucousMembranes,
      respiratoryRate,
      temperature,
      timeRecorded,
      weight,
      notes
    } = await req.json()

    const validation = await validateTokensAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: vitalSignsUpdateTokenCost,
      actionName: 'update vital signs',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingVitalSigns = await prisma.vitalSigns.findUnique({
      where: { id: vitalSignsId }
    })

    if (!existingVitalSigns) {
      return NextResponse.json({ error: 'VitalSigns not found', sliceName: sliceVitalSigns }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (bloodPressure !== null) updateData.bloodPressure = bloodPressure
    if (capillaryRefillTime !== null) updateData.capillaryRefillTime = capillaryRefillTime
    if (heartRate !== null) updateData.heartRate = heartRate
    if (hydrationStatus !== null) updateData.hydrationStatus = hydrationStatus
    if (mucousMembranes !== null) updateData.mucousMembranes = mucousMembranes
    if (respiratoryRate !== null) updateData.respiratoryRate = respiratoryRate
    if (temperature !== null) updateData.temperature = temperature
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded
    if (weight !== null) updateData.weight = weight
    if (notes !== null) updateData.notes = notes

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const newVitalSigns = await tx.vitalSigns.update({
        where: { id: vitalSignsId },
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
          tokens: { decrement: vitalSignsUpdateTokenCost },
          tokensUsed: { increment: vitalSignsUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -vitalSignsUpdateTokenCost,
          type: 'VITAL_SIGNS_UPDATE',
          description: `Vital signs update`,
          metadata: {
            ...updateData,
            feature: 'vital_signs_update'
          }
        }
      })

      return { newVitalSigns, updatedUser }
    })

    await createLog('info', 'VitalSigns updated successfully', {
      location: ['api route - POST /api/vitalSigns/[vitalSignsId]/update'],
      name: 'VitalSignsCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      vitalSignsId: result.newVitalSigns.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        vitalSigns: result.newVitalSigns,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: sliceVitalSigns
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Vital signs updated',
      sliceName: sliceVitalSigns
    })
  }
}
