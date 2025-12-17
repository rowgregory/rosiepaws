import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import prisma from '@/prisma/client'
import { sliceWalk } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth()

    const vitalSigns = await prisma.vitalSigns.findMany({
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

    return NextResponse.json(vitalSigns, { status: 201 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'List all vital signs by user',
      sliceName: sliceWalk
    })
  }
}
