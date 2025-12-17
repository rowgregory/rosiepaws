import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import prisma from '@/prisma/client'
import { sliceWater } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth()

    const waters = await prisma.water.findMany({
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

    return NextResponse.json(waters, { status: 201 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'List my waters',
      sliceName: sliceWater
    })
  }
}
