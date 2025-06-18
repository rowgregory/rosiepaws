import { createLog } from '@/app/lib/utils/logHelper'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const body = await req.json()

    const {
      petId,
      drugName,
      dosage,
      dosageUnit,
      frequency,
      customFrequency,
      startDate,
      endDate,
      reminderEnabled,
      reminderTimes,
      instructions,
      prescribedBy,
      timezoneOffset // Add user email for sending notification
    } = body

    // Validate required fields
    if (!petId || !drugName || !dosage || !dosageUnit || !frequency || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create medication in database
    const medication = await prisma.medication.create({
      data: {
        petId,
        drugName,
        dosage,
        dosageUnit,
        frequency,
        customFrequency: customFrequency || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        reminderEnabled: reminderEnabled || false,
        reminderTimes: reminderTimes || [],
        instructions: instructions || null,
        prescribedBy: prescribedBy || null,
        timezoneOffset
      },
      include: {
        pet: true // Include pet data for email
      }
    })

    await createLog('info', 'Medication created successfully with no reminders', {
      location: ['api route - POST /api/pet/create-medication'],
      name: 'MedicationCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      painScoreId: medication.id,
      ownerId
    })

    return NextResponse.json({ success: true, medication })
  } catch (error: any) {
    await createLog('error', `Medication creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
