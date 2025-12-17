import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import prisma from '@/prisma/client'
import { sliceGallery } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await requireAuth()

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
  }
}
