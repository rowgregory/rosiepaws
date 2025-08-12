import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { validateOwnerAndPet } from '@/app/lib/api/validateOwnerAndPet'
import prisma from '@/prisma/client'
import { sliceGallery } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

// Token cost for toggling public status
const togglePublicTokenCost = 1

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const galleryItemId = parameters.galleryItemId
    const body = await req.json()
    const isPublic = !body.isPublic

    // Validate that the gallery item exists and belongs to user
    const existingGalleryItem = await prisma.galleryItem.findUnique({
      where: { id: galleryItemId },
      select: {
        id: true,
        userId: true,
        petId: true,
        isPublic: true,
        name: true
      }
    })

    if (!existingGalleryItem) {
      return NextResponse.json({ message: 'Gallery item not found', sliceName: 'galleryApi' }, { status: 404 })
    }

    // Check if user owns this gallery item
    if (existingGalleryItem.userId !== userAuth.userId) {
      return NextResponse.json(
        { message: 'Forbidden: You do not own this gallery item', sliceName: 'galleryApi' },
        { status: 403 }
      )
    }

    // Validate user has enough tokens and pet exists
    const validation = await validateOwnerAndPet({
      userId: userAuth.userId,
      petId: existingGalleryItem.petId,
      tokenCost: togglePublicTokenCost,
      actionName: 'gallery item public toggle',
      req,
      user: userAuth.user
    })

    if (!validation.success) {
      return validation.response
    }

    // Validate isPublic is a boolean
    if (typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { message: 'isPublic must be a boolean value', sliceName: 'galleryApi' },
        { status: 400 }
      )
    }

    // Check if the value is actually changing
    if (existingGalleryItem.isPublic === isPublic) {
      return NextResponse.json(
        {
          message: 'Gallery item is already set to this visibility',
          galleryItem: existingGalleryItem,
          sliceName: 'galleryApi'
        },
        { status: 200 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update the gallery item
      const updatedGalleryItem = await tx.galleryItem.update({
        where: { id: galleryItemId },
        data: { isPublic },
        select: {
          id: true,
          isPublic: true,
          name: true,
          url: true,
          type: true,
          createdAt: true,
          pet: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          tokens: { decrement: togglePublicTokenCost },
          tokensUsed: { increment: togglePublicTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -togglePublicTokenCost,
          type: 'GALLERY_ITEM_UPDATE',
          description: `Gallery item visibility changed to ${isPublic ? 'public' : 'private'}`,
          metadata: {
            galleryItemId: updatedGalleryItem.id,
            petId: existingGalleryItem.petId,
            feature: 'gallery_toggle_public',
            previousValue: existingGalleryItem.isPublic,
            newValue: isPublic,
            itemName: updatedGalleryItem.name
          }
        }
      })

      return { updatedGalleryItem, updatedUser }
    })

    return NextResponse.json(
      {
        galleryItem: result.updatedGalleryItem,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: 'galleryApi'
      },
      { status: 200 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Gallery item updated',
      sliceName: sliceGallery
    })
  }
}
