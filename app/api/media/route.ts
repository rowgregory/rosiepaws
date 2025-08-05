import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceMedia } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Execute queries
    const [media, totalCount] = await Promise.all([
      prisma.media.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.media.count()
    ])

    // Transform BigInt to string for JSON serialization
    const serializedMedia = media.map((item) => ({
      ...item,
      sizeBytes: item.sizeBytes ? item.sizeBytes.toString() : null
    }))

    return NextResponse.json(
      {
        success: true,
        media: serializedMedia,
        pagination: {
          totalCount
        }
      },
      { status: 200 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Get all media',
      sliceName: sliceMedia
    })
  } finally {
    await prisma.$disconnect()
  }
}
