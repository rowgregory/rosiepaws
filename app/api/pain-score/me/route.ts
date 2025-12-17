import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import prisma from '@/prisma/client'
import { slicePainScore } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth()

    const painScores = await prisma.painScore.findMany({
      where: {
        pet: {
          ownerId: user.id
        }
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true
          }
        }
      },
      orderBy: { timeRecorded: 'desc' }
    })

    return NextResponse.json({ painScores }, { status: 201 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'List my pain scores',
      sliceName: slicePainScore
    })
  }
}
