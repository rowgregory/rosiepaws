import { createLog } from '@/app/lib/utils/logHelper'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const body = await req.json()
    const { id, ...updateFields } = body

    // Validate medication ID
    if (!id) {
      return NextResponse.json({ error: 'Missing medication ID' }, { status: 400 })
    }

    // Check if medication exists and belongs to user's pet
    const existingMedication = await prisma.medication.findFirst({
      where: {
        id: id,
        pet: {
          ownerId: ownerId
        }
      }
    })

    if (!existingMedication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {}

    if (updateFields.petId !== undefined) updateData.petId = updateFields.petId
    if (updateFields.drugName !== undefined) updateData.drugName = updateFields.drugName
    if (updateFields.dosage !== undefined) updateData.dosage = updateFields.dosage
    if (updateFields.dosageUnit !== undefined) updateData.dosageUnit = updateFields.dosageUnit
    if (updateFields.frequency !== undefined) updateData.frequency = updateFields.frequency
    if (updateFields.customFrequency !== undefined) updateData.customFrequency = updateFields.customFrequency || null
    if (updateFields.startDate !== undefined) updateData.startDate = new Date(updateFields.startDate)
    if (updateFields.endDate !== undefined)
      updateData.endDate = updateFields.endDate ? new Date(updateFields.endDate) : null
    if (updateFields.reminderEnabled !== undefined) updateData.reminderEnabled = updateFields.reminderEnabled
    if (updateFields.reminderTimes !== undefined) updateData.reminderTimes = updateFields.reminderTimes || []
    if (updateFields.instructions !== undefined) updateData.instructions = updateFields.instructions || null
    if (updateFields.prescribedBy !== undefined) updateData.prescribedBy = updateFields.prescribedBy || null
    if (updateFields.timezoneOffset !== undefined) updateData.timezoneOffset = Number(updateFields.timezoneOffset)

    // Check if reminder settings changed
    const reminderSettingsChanged =
      (updateFields.reminderEnabled !== undefined &&
        existingMedication.reminderEnabled !== updateFields.reminderEnabled) ||
      (updateFields.reminderTimes !== undefined &&
        JSON.stringify(existingMedication.reminderTimes) !== JSON.stringify(updateFields.reminderTimes))

    if (reminderSettingsChanged) {
      updateData.lastReminderDate = null
      updateData.sentRemindersToday = []
    }

    // Update medication
    const updatedMedication = await prisma.medication.update({
      where: { id },
      data: updateData,
      include: { pet: true }
    })

    await createLog('info', 'Medication partially updated successfully', {
      location: ['api route - PATCH /api/pet/update-medication'],
      name: 'MedicationPartialUpdate',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      id,
      ownerId,
      updatedFields: Object.keys(updateData),
      reminderSettingsChanged
    })

    return NextResponse.json({
      success: true,
      medication: updatedMedication,
      reminderSettingsReset: reminderSettingsChanged
    })
  } catch (error: any) {
    await createLog('error', `Medication partial update failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ error: 'Failed to update medication' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
