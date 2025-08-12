import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceGallery } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const galleryItems = await prisma.galleryItem.findMany({
      where: {
        isPublic: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ galleryItems }, { status: 201 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'List public gallery items',
      sliceName: sliceGallery
    })
  } finally {
    await prisma.$disconnect()
  }
}
