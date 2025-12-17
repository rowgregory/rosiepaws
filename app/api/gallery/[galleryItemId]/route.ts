
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import { galleryDeleteTokenCost } from '@/app/lib/constants/public/token' // Adjust import path as needed
import { deleteFileFromFirebase, getFirebaseTypeFromMediaType } from '@/app/utils/firebase-helpers'
import prisma from '@/prisma/client'
import { sliceGallery } from '@/public/data/api.data' // Adjust import path as needed
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const {user} = await requireAuth();

    const parameters = await params
    const galleryItemId = parameters.galleryItemId

    if (!galleryItemId) {
      return NextResponse.json({ error: 'Gallery item ID is required', sliceName: sliceGallery }, { status: 400 })
    }

    // Check if gallery item exists
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id: galleryItemId }
    })

    if (!galleryItem) {
      return NextResponse.json({ error: 'Gallery item not found', sliceName: sliceGallery }, { status: 404 })
    }

    if (galleryItem.name && galleryItem.type) {
      const firebaseType = getFirebaseTypeFromMediaType(galleryItem.type)
      await deleteFileFromFirebase(galleryItem.name, firebaseType)
    }

    // Use transaction to ensure atomicity
    await prisma.$transaction(
      async (tx) => {
        // Delete the gallery item
        await tx.galleryItem.delete({
          where: { id: galleryItemId }
        })

        // Deduct tokens from user
        await tx.user.update({
          where: { id: user.id },
          data: {
            tokens: { decrement: galleryDeleteTokenCost },
            tokensUsed: { increment: galleryDeleteTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: user.id!,
            amount: -galleryDeleteTokenCost, // Negative for debit
            type: 'GALLERY_ITEM_DELETE',
            description: 'Gallery item delete'
          }
        })
      },
      {
        timeout: 30000
      }
    )

    return NextResponse.json({
      sliceName: sliceGallery
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Gallery item deleted',
      sliceName: sliceGallery
    })
  }
}
