import { createLog } from '@/app/lib/utils/logHelper'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

interface CreateSeizureRequest {
  petId: string
  timeTaken: string
  duration: number
  notes?: string
  videoUrl?: string
  videoFilename?: string
}

export async function POST(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const body: CreateSeizureRequest = await req.json()

    const { petId, timeTaken, duration, notes, videoUrl, videoFilename } = body

    const pet = await prisma.pet.findUnique({
      where: { id: petId }
    })

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    // Convert duration from minutes to seconds for database storage
    const durationInSeconds = duration ? Math.round(duration * 60) : 0

    // Create seizure record
    const newSeizure = await prisma.seizure.create({
      data: {
        petId,
        duration: durationInSeconds,
        timeTaken: new Date(timeTaken),
        notes: notes || null,
        videoUrl: videoUrl || null,
        videoFilename: videoFilename || null
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
            age: true,
            weight: true,
            gender: true
          }
        }
      }
    })

    // Convert duration back to minutes for response

    await createLog('info', 'Seizure created successfully', {
      location: ['api route - POST /api/pet/create-seizure'],
      name: 'SeizureCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      seizureId: newSeizure.id,
      ownerId
    })

    return NextResponse.json(
      {
        success: true,
        seizure: newSeizure
      },
      { status: 201 }
    )
  } catch (error: any) {
    await createLog('error', `Seizure creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to create seizure record'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
