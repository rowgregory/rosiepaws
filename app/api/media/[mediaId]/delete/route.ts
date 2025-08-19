import { handleApiError } from '@/app/lib/api/handleApiError'
import { deleteFileFromFirebase } from '@/app/utils/firebase-helpers'
import prisma from '@/prisma/client'
import { sliceMedia } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

const getFirebaseType = (fileName: string) => {
  const ext = fileName?.split?.('.')?.pop()?.toLowerCase()
  if (!ext) return 'ebook'

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(ext)) return 'poster'
  if (['pdf'].includes(ext)) return 'ebook'
  return 'document'
}

export async function DELETE(req: NextRequest, { params }: any) {
  const parameters = await params
  const mediaId = parameters.mediaId
  const body = await req.json()

  try {
    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      const media = await tx.media.findFirst({
        where: {
          id: mediaId
        }
      })

      if (!media) {
        return NextResponse.json({ error: 'Media not found', sliceName: sliceMedia }, { status: 400 })
      }

      const firebaseType = getFirebaseType(media.fileName)
      await deleteFileFromFirebase(body.fileName, firebaseType)

      await tx.media.delete({ where: { id: mediaId } })
    })

    return NextResponse.json(
      {
        message: 'Media deleted successfully',
        sliceName: sliceMedia
      },
      { status: 200 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Delete media',
      sliceName: sliceMedia
    })
  } finally {
    await prisma.$disconnect()
  }
}
