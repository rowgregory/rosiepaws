import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { createLog } from '@/app/lib/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { slicePet } from '@/public/data/api.data'

export async function GET(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const pets = await prisma.pet.findMany({
      where: { ownerId },
      include: {
        painScores: true,
        feedings: true,
        bloodSugars: true,
        seizures: true,
        waters: true,
        medications: {
          include: {
            pet: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    const painScores = pets.flatMap((pet) => pet.painScores || [])
    const feedings = pets.flatMap((pet) => pet.feedings || [])
    const bloodSugars = pets.flatMap((pet) => pet.bloodSugars || [])
    const seizures = pets.flatMap((pet) => pet.seizures || [])
    const waters = pets.flatMap((pet) => pet.waters || [])
    const medications = pets.flatMap((pet) => pet.medications || [])

    return NextResponse.json(
      { pets, painScores, feedings, bloodSugars, seizures, waters, medications, sliceName: slicePet },
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
