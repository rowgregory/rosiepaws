import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { calculatePetStats } from '@/app/lib/utils/public/dashboard/calculatePetStats'
import { processChartDataForPet } from '@/app/lib/utils/public/dashboard/processChartData'
import prisma from '@/prisma/client'
import { sliceUser } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userAuth.userId
      },
      select: {
        id: true,
        role: true,
        email: true,
        isSuperUser: true,
        isAdmin: true,
        isFreeUser: true,
        isComfortUser: true,
        isLegacyUser: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
        tokens: true,
        tokensUsed: true,
        image: true,
        pets: true,
        stripeSubscription: true,
        galleryItems: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    const appointmentsToUpdate = await prisma.appointment.findMany({
      where: { status: { not: 'COMPLETED' } },
      select: { id: true, date: true, time: true }
    })

    const tokenTransactions = await prisma.tokenTransaction.findMany({
      where: { userId: userAuth.userId }
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
        vitalSigns: createRelationConfig(),
        movements: createRelationConfig(),
        appointments: createRelationConfig('createdAt'),
        medications: createRelationConfig('createdAt'),
        _count: {
          select: {
            appointments: true,
            bloodSugars: true,
            feedings: true,
            medications: true,
            movements: true,
            painScores: true,
            seizures: true,
            vitalSigns: true,
            waters: true
          }
        }
      }
    })

    // Calculate if user has NO logs across ALL pets
    // Add noLogs to each pet
    const petsWithNoLogs = pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      noLogs: Object.values(pet._count).every((count) => count === 0)
    }))

    const painScores = pets.flatMap((pet) => pet.painScores || [])
    const feedings = pets.flatMap((pet) => pet.feedings || [])
    const bloodSugars = pets.flatMap((pet) => pet.bloodSugars || [])
    const seizures = pets.flatMap((pet) => pet.seizures || [])
    const waters = pets.flatMap((pet) => pet.waters || [])
    const medications = pets.flatMap((pet) => pet.medications || [])
    const vitalSigns = pets.flatMap((pet) => pet.vitalSigns || [])
    const appointments = pets.flatMap((pet) => pet.appointments || [])
    const movements = pets.flatMap((pet) => pet.movements || [])
    const chartData = processChartDataForPet(pets[0])
    const stats = calculatePetStats(pets[0], chartData)

    return NextResponse.json(
      {
        pets,
        user,
        painScores,
        feedings,
        bloodSugars,
        seizures,
        waters,
        medications,
        vitalSigns,
        appointments,
        movements,
        tokenTransactions,
        chartData,
        stats,
        petsWithNoLogs,
        sliceName: sliceUser
      },
      { status: 201 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'List my data',
      sliceName: sliceUser
    })
  } finally {
    await prisma.$disconnect()
  }
}
