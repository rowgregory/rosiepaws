import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAuth } from '@/app/lib/auth/getServerSession'
import { deleteFileFromFirebase } from '@/app/utils/firebase-helpers'
import prisma from '@/prisma/client'
import { sliceSeizure } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const {user} = await requireAuth();

    const parameters = await params
    const seizureId = parameters.seizureId

    if (!seizureId) {
      return NextResponse.json({ error: 'Seizure ID is required', sliceName: sliceSeizure }, { status: 400 })
    }

    // Check if seizure exists
    const existingSeizure = await prisma.seizure.findUnique({
      where: { id: seizureId }
    })

    if (!existingSeizure) {
      return NextResponse.json({ error: 'Seizure not found', sliceName: sliceSeizure }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Delete the seizure
        const deletedSeizure = await tx.seizure.delete({
          where: { id: seizureId },
          select: {
            id: true,
            timeRecorded: true,
            duration: true,
            videoUrl: true,
            videoFilename: true,
            seizureType: true,
            severity: true,
            triggerFactor: true,
            recoveryTime: true,
            pet: {
              select: {
                id: true
              }
            }
          }
        })

        if (deletedSeizure.videoFilename) {
          await deleteFileFromFirebase(deletedSeizure.videoFilename, 'video')
        }

        // Deduct tokens from user
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
            amount: 0, // Negative for debit
            type: user.isLegacyUser ? 'SEIZURE_TRACKING_DELETE_LEGACY' : 'SEIZURE_TRACKING_DELETE',
            description: `Seizure tracking delete${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              petId: deletedSeizure.id,
              feature: 'seizure_delete',
              duration: deletedSeizure.duration,
              timeRecorded: deletedSeizure.timeRecorded,
              videoUrl: deletedSeizure.videoUrl,
              videoFilename: deletedSeizure.videoFilename,
              severity: deletedSeizure.severity,
              seizureType: deletedSeizure.seizureType
            }
          }
        })

        return { deletedSeizure, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Seizure deleted successfully', {
      location: ['api route - POST /api/seizure/[seizureId]/delete'],
      name: 'SeizureDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedSeizure.pet.id,
      seizureId: result.deletedSeizure.id,
      userId: user.id
    })

    return NextResponse.json({
      seizure: result.deletedSeizure,
      sliceName: sliceSeizure,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Seizure deleted',
      sliceName: sliceSeizure
    })
  } 
}
