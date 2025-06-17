import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { createLog } from '@/app/lib/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { slicePet } from '@/public/data/api.data'

export async function POST(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const { petId, intakeType, milliliters, relativeIntake, timeRecorded, moodRating, notes } = await req.json()

    if (!petId || !intakeType || !timeRecorded || !moodRating) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, intakeType: ${intakeType}, milliliters: ${milliliters}, timeRecorded: ${timeRecorded}, and moodRading: ${moodRating} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Confirm pet exists
    const pet = await prisma.pet.findUnique({ where: { id: petId } })
    if (!pet) {
      await createLog('warning', 'Pet not found when creating water', {
        location: ['api route - POST /api/pet/create-water'],
        name: 'PetNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        petId,
        ownerId
      })
      return NextResponse.json({ message: 'Pet not found', sliceName: slicePet }, { status: 404 })
    }

    // Create PainScore entry
    const water = await prisma.water.create({
      data: {
        petId,
        intakeType,
        milliliters,
        relativeIntake,
        timeRecorded,
        moodRating,
        notes
      },
      include: {
        pet: true // Optional: attach pet info like name
      }
    })

    await createLog('info', 'Water created successfully', {
      location: ['api route - POST /api/pet/create-water'],
      name: 'WaterCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      waterId: water.id,
      ownerId
    })

    return NextResponse.json({ water, sliceName: slicePet }, { status: 201 })
  } catch (error: any) {
    await createLog('error', `Water creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Water creation failed', error, sliceName: slicePet }, { status: 500 })
  }
}
