import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import { appointmentDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceAppointment } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const session = await requireAuth();
    const user = session.user;
    const id = user?.id

    const parameters = await params
    const appointmentId = parameters.appointmentId

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required', sliceName: sliceAppointment }, { status: 400 })
    }

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found', sliceName: sliceAppointment }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Delete the appointment
        const deletedAppointment = await tx.appointment.delete({
          where: { id: appointmentId },
          select: {
            id: true,
            serviceType: true,
            description: true,
            date: true,
            time: true,
            pet: {
              select: {
                id: true
              }
            }
          }
        })

        // Deduct tokens from user
        const updatedUser = await tx.user.update({
          where: { id },
          data: {
            ...(!user.isLegacyUser && { tokens: { decrement: appointmentDeleteTokenCost } }),
            tokensUsed: { increment: appointmentDeleteTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: id!,
            amount: -appointmentDeleteTokenCost, // Negative for debit
            type: user.isLegacyUser ? 'APPOINTMENT_DELETE_LEGACY' : 'APPOINTMENT_DELETE',
            description: `Appointment delete${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              petId: deletedAppointment.id,
              feature: 'appointment_delete',
              date: deletedAppointment.date,
              time: deletedAppointment.time,
              serviceType: deletedAppointment.serviceType
            }
          }
        })

        return { deletedAppointment, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Appointment deleted successfully', {
      location: ['api route - POST /api/appointment/[appointmentId]/delete'],
      name: 'AppointmentDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedAppointment.pet.id,
      appointmentId: result.deletedAppointment.id,
      userId: id
    })

    return NextResponse.json({
      sliceName: sliceAppointment,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Appointment deleted',
      sliceName: sliceAppointment
    })
  }
}
