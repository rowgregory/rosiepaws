import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession';
import prisma from '@/prisma/client'
import { sliceMedia } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    await requireAuth();
    const parameters = await params
    const mediaId = parameters.mediaId
    const body = await req.json()
    
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const media = await tx.media.findFirst({
        where: {
          id: mediaId
        }
      })

      if (!media) {
        throw new Error('Media not found')
      }

      const updatedMedia = await tx.media.update({
        where: { id: mediaId },
        data: { tier: body.tier }
      })

      return { updatedMedia } // Return plain object
    })

    const serializedMedia = {
      ...result.updatedMedia,
      sizeBytes: result.updatedMedia.sizeBytes?.toString() || null
    }

    return NextResponse.json(
      {
        media: serializedMedia,
        message: 'Media updated successfully',
        sliceName: sliceMedia
      },
      { status: 200 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Upload media',
      sliceName: sliceMedia
    })
  } 
}
