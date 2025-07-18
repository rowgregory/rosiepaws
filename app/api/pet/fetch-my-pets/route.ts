import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { parseStack } from 'error-stack-parser-es/lite'
import { slicePet } from '@/public/data/api.data'
import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'

export async function GET(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const appointmentsToUpdate = await prisma.appointment.findMany({
      where: { status: { not: 'COMPLETED' } },
      select: { id: true, date: true, time: true }
    })

    const now = new Date()
    const pastAppointmentIds = appointmentsToUpdate
      .filter((apt: any) => {
        const [hours, minutes] = apt.time.split(':')
        const appointmentDateTime = new Date(apt.date)
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        return appointmentDateTime < now
      })
      .map((apt) => apt.id)

    if (pastAppointmentIds.length > 0) {
      await prisma.appointment.updateMany({
        where: { id: { in: pastAppointmentIds } },
        data: { status: 'COMPLETED' }
      })
    }

    const createRelationConfig = (orderByField = 'timeRecorded') => ({
      orderBy: {
        [orderByField]: 'desc'
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            breed: true,
            type: true
          }
        }
      }
    })

    const pets = await prisma.pet.findMany({
      where: { ownerId: userAuth.userId },
      include: {
        painScores: createRelationConfig(),
        feedings: createRelationConfig(),
        bloodSugars: createRelationConfig(),
        seizures: createRelationConfig(),
        waters: createRelationConfig(),
        walks: createRelationConfig(),
        movements: createRelationConfig(),
        appointments: createRelationConfig('createdAt'),
        medications: createRelationConfig('createdAt')
      }
    })

    const owner = await prisma.user.findUnique({
      where: { id: userAuth.userId }
    })

    const painScores = pets.flatMap((pet) => pet.painScores || [])
    const feedings = pets.flatMap((pet) => pet.feedings || [])
    const bloodSugars = pets.flatMap((pet) => pet.bloodSugars || [])
    const seizures = pets.flatMap((pet) => pet.seizures || [])
    const waters = pets.flatMap((pet) => pet.waters || [])
    const medications = pets.flatMap((pet) => pet.medications || [])
    const walks = pets.flatMap((pet) => pet.walks || [])
    const appointments = pets.flatMap((pet) => pet.appointments || [])
    const movements = pets.flatMap((pet) => pet.movements || [])

    return NextResponse.json(
      {
        pets,
        painScores,
        feedings,
        bloodSugars,
        seizures,
        waters,
        medications,
        walks,
        appointments,
        movements,
        user: owner,
        sliceName: slicePet
      },
      { status: 200 }
    )
  } catch (error: any) {
    await createLog('error', `Fetch pets failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Fetch pets failed', error, sliceName: slicePet }, { status: 500 })
  }
}
