import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceAppointment } from '@/public/data/api.data'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { appointmentCreateTokenCost } from '@/app/lib/constants/public/token'
import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();

    const { petId, date, time, serviceType, description, veterinarian, reminderTime, reminderEnabled, notes } =
      await req.json()

    if (!petId || !date || !time || !serviceType) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, date: ${date}, time: ${time}, and serviceType: ${serviceType} are required`,
          sliceName: sliceAppointment
        },
        { status: 400 }
      )
    }

    const validation = await validateTokensAndPet({
      userId: user.id!,
      petId,
      tokenCost: appointmentCreateTokenCost,
      actionName: 'appointment',
      req,
      user
    })

    if (!validation.success) {
      return validation.response! // This is the NextResponse with error details
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Create Appointment entry
        const newAppointment = await tx.appointment.create({
          data: {
            petId,
            date,
            time,
            serviceType,
            description,
            veterinarian,
            reminderTime,
            reminderEnabled,
            notes
          },
          include: {
            pet: true
          }
        })

        // Deduct tokens from user
        const updatedUser = await tx.user.update({
          where: { id:user.id },
          data: {
            ...(!user.isLegacyUser && { tokens: { decrement: appointmentCreateTokenCost } }),
            tokensUsed: { increment: appointmentCreateTokenCost }
          }
        })

        await tx.tokenTransaction.create({
          data: {
            userId:user.id!,
            amount: -appointmentCreateTokenCost,
            type: user.isLegacyUser ? 'APPOINTMENT_CREATION_LEGACY' : 'APPOINTMENT_CREATION',
            description: `Appointment creation${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              appointmentId: newAppointment?.id,
              appointmentServiceType: newAppointment?.serviceType,
              feature: 'appointment_creation'
            }
          }
        })

        return { newAppointment, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Appointment created successfully', {
      location: ['api route - POST /api/pet/create-appointment'],
      name: 'AppointmentCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      appointmentId: result.newAppointment.id,
      userId: user.id
    })

    return NextResponse.json(
      {
        appointment: result.newAppointment,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: sliceAppointment
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Appointment creation',
      sliceName: sliceAppointment
    })
  }
}
