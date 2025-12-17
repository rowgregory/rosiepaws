import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceSeizure } from '@/public/data/api.data'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { requireAuth } from '@/app/lib/auth/getServerSession'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const {user} = await requireAuth();

    const parameters = await params
    const seizureId = parameters.seizureId

    if (!seizureId) {
      return NextResponse.json({ error: 'Seizure ID is required' }, { status: 400 })
    }

    const {
      petId,
      timeRecorded,
      duration,
      notes,
      videoUrl,
      videoFilename,
      seizureType,
      severity,
      triggerFactor,
      recoveryTime
    } = await req.json()

    if (!petId || !timeRecorded || !duration) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, timeRecorded: ${timeRecorded}, and duration: ${duration} are required`,
          sliceName: sliceSeizure
        },
        { status: 400 }
      )
    }

    const validation = await validateTokensAndPet({
      userId: user.id!,
      petId,
      tokenCost: 0,
      actionName: 'update seizure',
      req,
      user
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingSeizure = await prisma.seizure.findUnique({
      where: { id: seizureId },
      include: { pet: true }
    })

    if (!existingSeizure) {
      return NextResponse.json({ error: 'Seizure not found', sliceName: sliceSeizure }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded
    if (duration !== null) updateData.duration = duration
    if (notes !== null) updateData.notes = notes
    if (videoUrl !== null) updateData.videoUrl = videoUrl
    if (videoFilename !== null) updateData.videoFilename = videoFilename
    if (seizureType !== null) updateData.seizureType = seizureType
    if (severity !== null) updateData.severity = severity
    if (triggerFactor !== null) updateData.triggerFactor = triggerFactor
    if (recoveryTime !== null) updateData.recoveryTime = recoveryTime

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        const newSeizure = await tx.seizure.update({
          where: { id: seizureId },
          data: updateData,
          include: {
            pet: {
              select: {
                id: true,
                name: true,
                type: true,
                breed: true
              }
            }
          }
        })

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            ...(!user.isLegacyUser && { tokens: { decrement: 0 } }),
            tokensUsed: { increment: 0 }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: user.id!,
            amount: 0,
            type: user.isLegacyUser ? 'SEIZURE_TRACKING_UPDATE_LEGACY' : 'SEIZURE_TRACKING_UPDATE',
            description: `Seizure tracking update${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              ...updateData,
              feature: 'seizure_update'
            }
          }
        })

        return { newSeizure, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Seizure updated successfully', {
      location: ['api route - POST /api/seizure/[seizureId]/update'],
      name: 'SeizureUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      seizureId: result.newSeizure.id,
      userId: user.id
    })

    return NextResponse.json(
      {
        seizure: result.newSeizure,
        sliceName: sliceSeizure,
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
      action: 'Seizure updated',
      sliceName: sliceSeizure
    })
  }
}
