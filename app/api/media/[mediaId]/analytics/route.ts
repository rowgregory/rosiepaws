import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { sliceMedia } from '@/public/data/api.data'
import prisma from '@/prisma/client'

export async function PUT(req: NextRequest, { params }: any) {
  const parameters = await params
  const mediaId = parameters.mediaId
  const { action } = await req.json()

  try {
    const analyticsAction = (action as string)?.toUpperCase()

    if (!['VIEW', 'DOWNLOAD', 'SHARE'].includes(analyticsAction)) {
      return NextResponse.json(
        {
          error: 'Invalid action. Must be VIEW, DOWNLOAD, or SHARE'
        },
        { status: 400 }
      )
    }

    const media = await prisma.media.findFirst({
      where: {
        id: mediaId
      }
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Update counters directly on the Media model
    const updateData: any = {}

    if (analyticsAction === 'VIEW') {
      updateData.views = { increment: 1 }
    } else if (analyticsAction === 'DOWNLOAD') {
      updateData.downloads = { increment: 1 }
    }

    // Only update if we have data to update
    if (Object.keys(updateData).length > 0) {
      await prisma.media.update({
        where: { id: mediaId },
        data: updateData
      })
    }

    return NextResponse.json(
      {
        message: `${analyticsAction.toLowerCase()} recorded successfully`,
        action: analyticsAction,
        mediaId: mediaId
      },
      { status: 200 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Update media analytics',
      sliceName: sliceMedia
    })
  }
}
