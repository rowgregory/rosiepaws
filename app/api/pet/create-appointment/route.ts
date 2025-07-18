import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePet } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { appointmentCreateTokenCost } from '@/app/lib/constants/token'
import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const { petId, date, time, serviceType, description, veterinarian, reminderTime, reminderEnabled, notes } =
      await req.json()

    if (!petId || !date || !time || !serviceType) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, date: ${date}, time: ${time}, and serviceType: ${serviceType} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId ?? '',
      petId,
      tokenCost: appointmentCreateTokenCost,
      actionName: 'appointment',
      req
    })

    if (!validation.success) {
      return validation.response! // This is the NextResponse with error details
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create Appointment entry
      const newAppointment = await prisma.appointment.create({
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
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: appointmentCreateTokenCost },
          tokensUsed: { increment: appointmentCreateTokenCost }
        }
      })

      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -appointmentCreateTokenCost,
          type: 'APPOINTMENT_CREATION',
          description: `Appointment creation`,
          metadata: {
            appointmentId: newAppointment.id,
            appointmentServiceType: newAppointment.serviceType,
            feature: 'appointment_creation'
          }
        }
      })

      return { newAppointment, updatedUser }
    })

    await createLog('info', 'Appointment created successfully', {
      location: ['api route - POST /api/pet/create-appointment'],
      name: 'AppointmentCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      appointmentId: result.newAppointment.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        appointment: result.newAppointment,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: slicePet
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Appointment creation',
      sliceName: slicePet
    })
  }
}
