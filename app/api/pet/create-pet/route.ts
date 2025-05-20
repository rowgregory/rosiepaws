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

    const { name, type, breed, age, gender, weight, notes } = await req.json()

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { message: 'Missing required fields: name and type are required', sliceName: slicePet },
        { status: 400 }
      )
    }

    // Confirm owner exists (optional since user is logged in, but good safety)
    const owner = await prisma.user.findUnique({ where: { id: ownerId } })
    if (!owner) {
      await createLog('warning', 'Owner user not found when creating pet', {
        location: ['api route - POST /api/pets'],
        name: 'OwnerNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ownerId
      })
      return NextResponse.json({ message: 'Owner not found', sliceName: slicePet }, { status: 404 })
    }

    // Create the pet
    const newPet = await prisma.pet.create({
      data: {
        name,
        type,
        breed,
        age,
        gender,
        weight,
        ownerId,
        notes
      }
    })

    await createLog('info', 'Pet created successfully', {
      location: ['api route - POST /api/pets'],
      name: 'PetCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: newPet.id,
      ownerId
    })

    return NextResponse.json({ pet: newPet, sliceName: slicePet }, { status: 201 })
  } catch (error: any) {
    await createLog('error', `Pet creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Pet creation failed', error, sliceName: slicePet }, { status: 500 })
  }
}
