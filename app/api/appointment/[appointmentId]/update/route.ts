import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceAppointment } from '@/public/data/api.data'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { appointmentUpdateTokenCost } from '@/app/lib/constants/public/token'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const appointmentId = parameters.appointmentId

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

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

    const validation = await validateOwnerAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: appointmentUpdateTokenCost,
      actionName: 'update appointment',
      req
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { pet: true }
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found', sliceName: sliceAppointment }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (date !== null) updateData.date = date
    if (time !== null) updateData.time = time
    if (serviceType !== null) updateData.serviceType = serviceType
    if (description !== null) updateData.description = description
    if (veterinarian !== null) updateData.veterinarian = veterinarian
    if (reminderTime !== null) updateData.reminderTime = reminderTime
    if (reminderEnabled !== null) updateData.reminderEnabled = reminderEnabled
    if (notes !== null) updateData.notes = notes

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        const newAppointment = await tx.appointment.update({
          where: { id: appointmentId },
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
            tokens: { decrement: appointmentUpdateTokenCost },
            tokensUsed: { increment: appointmentUpdateTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: userAuth.userId!,
            amount: -appointmentUpdateTokenCost,
            type: 'APPOINTMENT_UPDATE',
            description: `Appointment update`,
            metadata: {
              ...updateData,
              feature: 'appointment_update'
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

    await createLog('info', 'Appointment updated successfully', {
      location: ['api route - POST /api/appointment/[appointmentId]/update'],
      name: 'AppointmentUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      appointmentId: result.newAppointment.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        sliceName: sliceAppointment,
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
      action: 'Appointment updated',
      sliceName: sliceAppointment
    })
  }
}
