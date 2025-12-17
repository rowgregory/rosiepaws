import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { sliceMovement } from '@/public/data/api.data'
import { validateMovementRequiredFields } from '@/app/lib/api/validateMovementRequiredFields'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { movementUpdateTokenCost } from '@/app/lib/constants/public/token'
import { requireAuth } from '@/app/lib/auth/getServerSession'

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const {user} = await requireAuth();

    const parameters = await params
    const movementId = parameters.movementId

    if (!movementId) {
      return NextResponse.json({ error: 'Movement ID is required' }, { status: 400 })
    }

    const {
      petId,
      movementType,
      activityLevel,
      timeRecorded,
      durationMinutes,
      distanceMeters,
      location,
      indoor,
      energyBefore,
      energyAfter,
      painBefore,
      painAfter,
      gaitQuality,
      mobility,
      assistance,
      wheelchair,
      harness,
      leash,
      enthusiasm,
      reluctance,
      limping,
      panting,
      restBreaks,
      recoveryTime,
      notes
    } = await req.json()

    const validatedFields = validateMovementRequiredFields({
      petId,
      userId: user.id,
      timeRecorded,
      movementType,
      activityLevel,
      energyBefore,
      energyAfter,
      mobility
    })

    if (!validatedFields.success) {
      return validatedFields.response!
    }

    const validation = await validateTokensAndPet({
      userId: user.id!,
      petId,
      tokenCost: movementUpdateTokenCost,
      actionName: 'update movement',
      req,
      user
    })

    if (!validation.success) {
      return validation.response!
    }

    const existingMovement = await prisma.movement.findUnique({
      where: { id: movementId },
      include: { pet: true }
    })

    if (!existingMovement) {
      return NextResponse.json({ error: 'Movement not found', sliceName: sliceMovement }, { status: 404 })
    }

    const updateData: any = {}

    if (petId !== null) updateData.petId = petId
    if (movementType !== null) updateData.movementType = movementType
    if (durationMinutes !== null) updateData.durationMinutes = durationMinutes
    if (distanceMeters !== null) updateData.distanceMeters = distanceMeters
    if (activityLevel !== null) updateData.activityLevel = activityLevel
    if (location !== null) updateData.location = location
    if (indoor !== null) updateData.indoor = indoor
    if (energyBefore !== null) updateData.energyBefore = energyBefore
    if (energyAfter !== null) updateData.energyAfter = energyAfter
    if (painBefore !== null) updateData.painBefore = painBefore
    if (painAfter !== null) updateData.painAfter = painAfter
    if (gaitQuality !== null) updateData.gaitQuality = gaitQuality
    if (mobility !== null) updateData.mobility = mobility
    if (assistance !== null) updateData.assistance = assistance
    if (wheelchair !== null) updateData.wheelchair = wheelchair
    if (harness !== null) updateData.harness = harness
    if (leash !== null) updateData.leash = leash
    if (enthusiasm !== null) updateData.enthusiasm = enthusiasm
    if (reluctance !== null) updateData.reluctance = leash
    if (limping !== null) updateData.limping = limping
    if (panting !== null) updateData.panting = panting
    if (restBreaks !== null) updateData.restBreaks = restBreaks
    if (recoveryTime !== null) updateData.recoveryTime = recoveryTime
    if (notes !== null) updateData.notes = notes
    if (timeRecorded !== null) updateData.timeRecorded = timeRecorded

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        const newMovement = await tx.movement.update({
          where: { id: movementId },
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
            ...(!user.isLegacyUser && { tokens: { decrement: movementUpdateTokenCost } }),
            tokensUsed: { increment: movementUpdateTokenCost }
          }
        })

        // Create token transaction record
        await tx.tokenTransaction.create({
          data: {
            userId: user.id!,
            amount: -movementUpdateTokenCost,
            type: user.isLegacyUser ? 'MOVEMENT_UPDATE_LEGACY' : 'MOVEMENT_UPDATE',
            description: `Movement update${user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              ...updateData,
              feature: 'movement_update'
            }
          }
        })

        return { newMovement, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Movement updated successfully', {
      location: ['api route - POST /api/movement/[movementId]/update'],
      name: 'MovementUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      movementId: result.newMovement.id,
      userId: user.id
    })

    return NextResponse.json(
      {
        sliceName: sliceMovement,
        movement: result.newMovement,
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
      action: 'Movement updated',
      sliceName: sliceMovement
    })
  } finally {
    await prisma.$disconnect()
  }
}
