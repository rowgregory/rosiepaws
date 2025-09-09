import sendMedicationReminder from '@/app/lib/resend/sendMedicationReminderEmail'
import { createLog } from '@/app/lib/api/createLog'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

async function markReminderSent(medicationId: string, today: string, currentTime: string) {
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
    select: { lastReminderDate: true, sentRemindersToday: true }
  })

  // If it's a new day, reset the array
  const isNewDay = medication?.lastReminderDate !== today

  await prisma.medication.update({
    where: { id: medicationId },
    data: {
      lastReminderDate: today,
      sentRemindersToday: isNewDay ? [currentTime] : { push: currentTime }
    }
  })
}

export async function GET(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"
    const today = now.toDateString() // "Mon Jun 17 2025"

    // Find medications that need reminders at this exact time
    const medications = await prisma.medication.findMany({
      where: {
        reminderEnabled: true,
        reminderTimes: {
          has: currentTime
        },
        OR: [
          // New day - hasn't been reset yet
          { lastReminderDate: { not: today } },
          { lastReminderDate: null },
          // Same day but this specific time hasn't been sent
          {
            AND: [
              { lastReminderDate: today },
              {
                NOT: {
                  sentRemindersToday: {
                    has: currentTime
                  }
                }
              }
            ]
          }
        ]
      },
      include: {
        pet: {
          include: {
            owner: true
          }
        }
      }
    })

    for (const medication of medications) {
      await sendMedicationReminder(medication, currentTime, req, ownerId)
      await markReminderSent(medication.id, today, currentTime)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    await createLog('error', `Fail to send medication reminder email: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json(
      {
        success: false
      },
      { status: 500 }
    )
  }
}
