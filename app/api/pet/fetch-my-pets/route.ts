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
        painScores: true, // This includes the associated PainScore(s)
        feedings: true,
        bloodSugars: true
      }
    })

    const painScores = await prisma.painScore.findMany({
      where: {
        pet: {
          ownerId: ownerId
        }
      },
      include: {
        pet: true // Optional: attach pet info like name
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    const feedings = await prisma.feeding.findMany({
      where: {
        pet: {
          ownerId: ownerId
        }
      },
      include: {
        pet: true // Optional: attach pet info like name
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    const bloodSugars = await prisma.bloodSugar.findMany({
      where: {
        pet: {
          ownerId: ownerId
        }
      },
      include: {
        pet: true // Optional: attach pet info like name
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    const seizures = await prisma.seizureActivity.findMany({
      where: {
        pet: {
          ownerId: ownerId
        }
      },
      include: {
        pet: true // Optional: attach pet info like name
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(
      { pets, painScores, feedings, bloodSugars, seizures, sliceName: slicePet },
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
