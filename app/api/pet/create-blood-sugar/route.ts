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

    const { petId, value, timeTaken, notes } = await req.json()

    if (!petId || !value || !timeTaken) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, value: ${value}, timeTaken: ${timeTaken} are required`,
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
    const bloodSugar = await prisma.bloodSugar.create({
      data: {
        petId,
        value,
        timeTaken,
        notes
      },
      include: {
        pet: true // Optional: attach pet info like name
      }
    })

    await createLog('info', 'Blood sugar created successfully', {
      location: ['api route - POST /api/pet/create-blood-sugar'],
      name: 'BloodSugarCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      bloodSugarId: bloodSugar.id,
      ownerId
    })

    return NextResponse.json({ bloodSugar, sliceName: slicePet }, { status: 201 })
  } catch (error: any) {
    await createLog('error', `Blood sugar creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Blood sugar creation failed', error, sliceName: slicePet }, { status: 500 })
  }
}
