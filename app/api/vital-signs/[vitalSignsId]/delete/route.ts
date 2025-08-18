import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { vitalSignsDeleteTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceVitalSigns } from '@/public/data/api.data'
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
    const vitalSignsId = parameters.vitalSignsId

    if (!vitalSignsId) {
      return NextResponse.json({ error: 'Vital Signs ID is required', sliceNam: sliceVitalSigns }, { status: 400 })
    }

    // Check if vitalSigns exists
    const existingVitalSigns = await prisma.vitalSigns.findUnique({
      where: { id: vitalSignsId }
    })

    if (!existingVitalSigns) {
      return NextResponse.json({ error: 'Vital Signs not found', sliceNam: sliceVitalSigns }, { status: 404 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete the vitalSigns
      const deletedVitalSigns = await tx.vitalSigns.delete({
        where: { id: vitalSignsId },
        select: { id: true, timeRecorded: true, pet: true }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          ...(!userAuth.user.isLegacyUser && { tokens: { decrement: vitalSignsDeleteTokenCost } }),
          tokensUsed: { increment: vitalSignsDeleteTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -vitalSignsDeleteTokenCost, // Negative for debit
          type: userAuth.user.isLegacyUser ? 'VITAL_SIGNS_DELETE_LEGACY' : 'VITAL_SIGNS_DELETE',
          description: `Vital signs delete${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            petId: deletedVitalSigns.pet.id,
            vitalSignsId: deletedVitalSigns.id,
            feature: 'delete',
            timeRecorded: deletedVitalSigns.timeRecorded
          }
        }
      })

      return { deletedVitalSigns, updatedUser }
    })

    await createLog('info', 'VitalSigns deleted successfully', {
      location: ['api route - POST /api/vitalSigns/[vitalSignsId]/delete'],
      name: 'VitalSignsDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId: result.deletedVitalSigns.pet.id,
      vitalSignsId: result.deletedVitalSigns.id,
      userId: userAuth.userId
    })

    return NextResponse.json({
      vitalSigns: result.deletedVitalSigns,
      sliceNam: sliceVitalSigns,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      }
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'VitalSigns delete',
      sliceName: sliceVitalSigns
    })
  } finally {
    await prisma.$disconnect()
  }
}
