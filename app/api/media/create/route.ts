import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceMedia } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const items = body.items

  // Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      {
        error: 'Invalid request',
        message: 'Items array is required',
        sliceName: sliceMedia
      },
      { status: 404 }
    )
  }

  try {
    // Validate each item
    const validatedItems = items.map((item, index) => {
      const requiredFields = ['title', 'type', 'format', 'size', 'fileName', 'filePath', 'mimeType']
      const missingFields = requiredFields.filter((field) => !item[field])

      if (missingFields.length > 0) {
        throw new Error(`Item ${index}: Missing required fields: ${missingFields.join(', ')}`)
      }

      return {
        title: item.title.trim(),
        type: item.type.toUpperCase(),
        format: item.format.toUpperCase(),
        size: item.size,
        sizeBytes: item.sizeBytes ? BigInt(item.sizeBytes) : null,
        fileName: item.fileName,
        filePath: item.filePath,
        mimeType: item.mimeType,
        thumbnail: item.thumbnail || null,
        color: item.color ? item.color.toUpperCase() : 'BLUE',
        tags: item.tags || [],
        views: item.views || 0,
        downloads: item.downloads || 0
      }
    })

    // Create media records using transaction for atomicity
    const createdMedia = await prisma.$transaction(async (tx) => {
      const results = []

      for (const item of validatedItems) {
        const media = await tx.media.create({
          data: item
        })
        results.push(media)
      }

      return results
    })

    // Transform BigInt to string for JSON serialization
    const serializedMedia = createdMedia.map((media) => ({
      ...media,
      sizeBytes: media.sizeBytes ? media.sizeBytes.toString() : null
    }))

    return NextResponse.json(
      {
        message: `Successfully created ${createdMedia.length} media record(s)`,
        data: serializedMedia,
        sliceName: sliceMedia
      },
      { status: 201 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Media creation',
      sliceName: sliceMedia
    })
  }
}
