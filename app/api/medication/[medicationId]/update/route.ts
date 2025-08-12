import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { medicationUpdateTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceMedication } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: any) {
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
      return NextResponse.json({ error: 'Missing medication ID' }, { status: 400 })
    }

    const body = await req.json()

    const validation = await validateTokensAndPet({
      userId: userAuth.userId!,
      petId: body.petId,
      tokenCost: medicationUpdateTokenCost,
      actionName: 'update medication',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingMedication = await prisma.medication.findFirst({
      where: { id: medicationId },
      include: { pet: true }
    })

    if (!existingMedication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    const updateData: any = {}

    if (body.petId !== null) updateData.petId = body.petId
    if (body.drugName !== null) updateData.drugName = body.drugName
    if (body.dosage !== null) updateData.dosage = body.dosage
    if (body.dosageUnit !== null) updateData.dosageUnit = body.dosageUnit
    if (body.frequency !== null) updateData.frequency = body.frequency
    if (body.customFrequency !== null) updateData.customFrequency = body.customFrequency || null
    if (body.startDate !== null) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== null) updateData.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.reminderEnabled !== null) updateData.reminderEnabled = body.reminderEnabled
    if (body.reminderTimes !== null) updateData.reminderTimes = body.reminderTimes || []
    if (body.prescribedBy !== null) updateData.prescribedBy = body.prescribedBy || null
    if (body.timezoneOffset !== null) updateData.timezoneOffset = Number(body.timezoneOffset)

    // Check if reminder settings changed
    const reminderSettingsChanged =
      (body.reminderEnabled !== undefined && existingMedication.reminderEnabled !== body.reminderEnabled) ||
      (body.reminderTimes !== undefined &&
        JSON.stringify(existingMedication.reminderTimes) !== JSON.stringify(body.reminderTimes))

    if (reminderSettingsChanged) {
      updateData.lastReminderDate = null
      updateData.sentRemindersToday = []
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const updatedMedication = await tx.medication.update({
        where: { id: medicationId },
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

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: medicationUpdateTokenCost },
          tokensUsed: { increment: medicationUpdateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -medicationUpdateTokenCost, // Negative for debit
          type: 'MEDICATION_UPDATE',
          description: `Medication updated`,
          metadata: {
            medicationId: updatedMedication.id,
            feature: 'medication_updated'
          }
        }
      })

      return { updatedMedication, updatedUser }
    })

    await createLog('info', 'Medication partially updated successfully', {
      location: ['api route - PATCH /api/medication/[medicationId]/update'],
      name: 'MedicationPartialUpdate',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      id: userAuth?.userId,
      ownerId: userAuth?.userId,
      updatedFields: Object.keys(updateData),
      reminderSettingsChanged
    })

    return NextResponse.json({
      medication: result.updatedMedication,
      reminderSettingsReset: reminderSettingsChanged,
      sliceName: sliceMedication,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Medication updated',
      sliceName: sliceMedication
    })
  } finally {
    await prisma.$disconnect()
  }
}
