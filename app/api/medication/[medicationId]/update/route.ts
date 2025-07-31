import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
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

    const existingMedication = await prisma.medication.findFirst({
      where: {
        id: medicationId,
        pet: {
          ownerId: userAuth?.userId
        }
      }
    })

    if (!existingMedication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    const updateData: any = {}

    if (body.petId !== undefined) updateData.petId = body.petId
    if (body.drugName !== undefined) updateData.drugName = body.drugName
    if (body.dosage !== undefined) updateData.dosage = body.dosage
    if (body.dosageUnit !== undefined) updateData.dosageUnit = body.dosageUnit
    if (body.frequency !== undefined) updateData.frequency = body.frequency
    if (body.customFrequency !== undefined) updateData.customFrequency = body.customFrequency || null
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.reminderEnabled !== undefined) updateData.reminderEnabled = body.reminderEnabled
    if (body.reminderTimes !== undefined) updateData.reminderTimes = body.reminderTimes || []
    if (body.instructions !== undefined) updateData.instructions = body.instructions || null
    if (body.prescribedBy !== undefined) updateData.prescribedBy = body.prescribedBy || null
    if (body.timezoneOffset !== undefined) updateData.timezoneOffset = Number(body.timezoneOffset)

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
        include: { pet: true }
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
      reminderSettingsReset: reminderSettingsChanged
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
