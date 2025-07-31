import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceWater } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const waters = await prisma.water.findMany({
      where: {
        pet: {
          ownerId: userAuth?.userId
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
  } finally {
    await prisma.$disconnect()
  }
}
