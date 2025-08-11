import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { galleryDeleteTokenCost } from '@/app/lib/constants/public/token' // Adjust import path as needed
import { deleteFileFromFirebase, getFirebaseTypeFromMediaType } from '@/app/utils/firebase-helpers'
import prisma from '@/prisma/client'
import { sliceGallery } from '@/public/data/api.data' // Adjust import path as needed
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const galleryItemId = parameters.galleryItemId

    if (!galleryItemId) {
      return NextResponse.json({ error: 'Gallery item ID is required', sliceName: sliceGallery }, { status: 400 })
    }

    // Check if gallery item exists
    const existingGalleryItem = await prisma.galleryItem.findUnique({
      where: { id: galleryItemId }
    })

    if (!existingGalleryItem) {
      return NextResponse.json({ error: 'Gallery item not found', sliceName: sliceGallery }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Delete the gallery item
        const deletedGalleryItem = await tx.galleryItem.delete({
          where: { id: galleryItemId },
          select: {
            id: true,
            name: true,
            type: true,
            pet: {
              select: {
                id: true
              }
            }
          }
        })

        if (deletedGalleryItem.name && deletedGalleryItem.type) {
          const firebaseType = getFirebaseTypeFromMediaType(deletedGalleryItem.type)
          await deleteFileFromFirebase(deletedGalleryItem.name, firebaseType)
        }

        // Deduct tokens from user
        const updatedUser = await tx.user.update({
          where: { id: userAuth.userId },
          data: {
            tokens: { decrement: galleryDeleteTokenCost },
            tokensUsed: { increment: galleryDeleteTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: userAuth.userId!,
            amount: -galleryDeleteTokenCost, // Negative for debit
            type: 'GALLERY_ITEM_DELETE',
            description: 'Gallery item delete',
            metadata: {
              galleryItemId: deletedGalleryItem.id,
              petId: deletedGalleryItem.pet.id,
              feature: 'gallery_item_delete',
              name: deletedGalleryItem.name,
              mediaType: deletedGalleryItem.type
            }
          }
        })

        return { deletedGalleryItem, updatedUser }
      },
      {
        timeout: 20000
      }
    )

    await createLog('info', 'Gallery item deleted successfully', {
      location: ['api route - DELETE /api/gallery/[galleryItemId]/delete'],
      name: 'GalleryItemDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedGalleryItem.pet.id,
      galleryItemId: result.deletedGalleryItem.id,
      userId: userAuth.userId,
      filename: result.deletedGalleryItem.name,
      type: result.deletedGalleryItem.type
    })

    return NextResponse.json({
      galleryItem: result.deletedGalleryItem,
      sliceName: sliceGallery,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
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
