import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { createLog } from '@/app/utils/logHelper'
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

    const { petId, foodAmount, foodType, notes, timeFed, moodRating } = await req.json()

    if (!petId || !foodAmount || !foodType || !timeFed) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, foodAmount: ${foodAmount}, foodType: ${foodType}, timeFed: ${timeFed} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Confirm pet exists
    const pet = await prisma.pet.findUnique({ where: { id: petId } })
    if (!pet) {
      await createLog('warning', 'Pet not found when creating feedomg', {
        location: ['api route - POST /api/pet/create-feeding'],
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
    const feeding = await prisma.feeding.create({
      data: {
        petId,
        foodAmount,
        foodType,
        notes,
        timeFed,
        moodRating
      },
      include: {
        pet: true // Optional: attach pet info like name
      }
    })

    await createLog('info', 'Feeding created successfully', {
      location: ['api route - POST /api/pet/create-feeding'],
      name: 'FeedingCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      painScoreId: feeding.id,
      ownerId
    })

    return NextResponse.json({ feeding, sliceName: slicePet }, { status: 201 })
  } catch (error: any) {
    await createLog('error', `Feeding creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Feeding creation failed', error, sliceName: slicePet }, { status: 500 })
  }
}
