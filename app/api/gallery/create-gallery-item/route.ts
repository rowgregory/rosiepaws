import { createLog } from '@/app/lib/api/createLog'
import prisma from '@/prisma/client'
import { sliceGallery } from '@/public/data/api.data'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')
    if (!userHeader) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing user header', sliceName: sliceGallery },
        { status: 401 }
      )
    }

    const parsedUser = JSON.parse(userHeader)
    const userId = parsedUser.id

    const { url, type, name, size, mimeType, thumbnail, description, tags, petId } = await req.json()

    // Validate required fields
    if (!url || !type || !name || !size || !mimeType || !petId) {
      return NextResponse.json(
        {
          message: 'Missing required fields: url, type, name, size, mimeType, and petId are required',
          sliceName: sliceGallery
        },
        { status: 400 }
      )
    }

    // Validate type enum
    if (!['IMAGE', 'VIDEO'].includes(type)) {
      return NextResponse.json(
        { message: 'Invalid type. Must be IMAGE or VIDEO', sliceName: sliceGallery },
        { status: 400 }
      )
    }

    // Verify user exists and owns the pet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pets: {
          where: { id: petId }
        }
      }
    })

    if (!user) {
      await createLog('warning', 'User not found when creating gallery item', {
        location: ['api route - POST /api/gallery/create-gallery-item'],
        name: 'UserNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        userId
      })
      return NextResponse.json({ message: 'User not found', sliceName: sliceGallery }, { status: 404 })
    }

    // Check if user owns the pet
    if (user.pets.length === 0) {
      await createLog('warning', 'Pet not found or user does not own pet', {
        location: ['api route - POST /api/gallery/create-gallery-item'],
        name: 'PetNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        userId,
        petId
      })
      return NextResponse.json({ message: 'Pet not found or access denied', sliceName: sliceGallery }, { status: 404 })
    }

    // Create the gallery item
    const newGalleryItem = await prisma.galleryItem.create({
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
        userId
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    })

    await createLog('info', 'Gallery item created successfully', {
      location: ['api route - POST /api/gallery/create-gallery-item'],
      name: 'GalleryItemCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      galleryItemId: newGalleryItem.id,
      petId,
      userId,
      fileType: type,
      fileSize: size
    })

    return NextResponse.json(
      {
        galleryItem: newGalleryItem,
        message: 'Gallery item created successfully',
        sliceName: sliceGallery
      },
      { status: 201 }
    )
  } catch (error: any) {
    await createLog('error', `Gallery item creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json(
      {
        message: 'Gallery item creation failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        sliceName: sliceGallery
      },
      { status: 500 }
    )
  }
}
