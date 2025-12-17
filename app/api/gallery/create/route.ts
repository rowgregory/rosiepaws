
import { handleApiError } from '@/app/lib/api/handleApiError'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import { galleryUploadTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceGallery } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();

    const { url, type, name, size, mimeType, thumbnail, description, tags, petId, isPublic } = await req.json()

    if (!url || !type || !name || !size || !mimeType || !petId) {
      return NextResponse.json(
        {
          message: 'Missing required fields: url, type, name, size, mimeType, and petId are required',
          sliceName: sliceGallery
        },
        { status: 400 }
      )
    }

    if (!['IMAGE', 'VIDEO'].includes(type)) {
      return NextResponse.json(
        { message: 'Invalid type. Must be IMAGE or VIDEO', sliceName: sliceGallery },
        { status: 400 }
      )
    }

    const validation = await validateTokensAndPet({
      userId: user.id!,
      petId,
      tokenCost: galleryUploadTokenCost,
      actionName: 'gallery item',
      req,
      user
    })

    if (!validation.success) {
      return validation.response!
    }

    const isPublicValue = isPublic === true || isPublic === 'true' || isPublic === '1'

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create the gallery item
      await tx.galleryItem.create({
        data: {
          url,
          type: type as 'IMAGE' | 'VIDEO',
          name,
          size,
          mimeType,
          thumbnail,
          description: description || null,
          tags: tags || [],
          petId,
          userId: user.id!,
          isPublic: isPublicValue
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          tokens: { decrement: galleryUploadTokenCost },
          tokensUsed: { increment: galleryUploadTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: user.id!,
          amount: -galleryUploadTokenCost,
          type: 'GALLERY_ITEM_CREATION',
          description: `Gallery item creation`,
          metadata: {
            feature: 'gallery_item_creation'
          }
        }
      })

      return { updatedUser }
    })

    return NextResponse.json(
      {
        sliceName: sliceGallery,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Gallery item creation',
      sliceName: sliceGallery
    })
  }
}
