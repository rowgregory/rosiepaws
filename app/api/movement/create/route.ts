import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateMovementRequiredFields } from '@/app/lib/api/validateMovementRequiredFields'
import { movementCreateTokenCost } from '@/app/lib/constants/public/token'
import prisma from '@/prisma/client'
import { sliceMovement } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
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
      userId: userAuth.userId,
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
      userId: userAuth.userId!,
      petId,
      tokenCost: movementCreateTokenCost,
      actionName: 'create movement',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response! // This is the NextResponse with error details
    }

    // Convert numeric fields
    const numericFields = {
      durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      distanceMeters: distanceMeters ? parseFloat(distanceMeters) : undefined,
      painBefore: painBefore ? parseInt(painBefore) : undefined,
      painAfter: painAfter ? parseInt(painAfter) : undefined,
      enthusiasm: enthusiasm ? parseInt(enthusiasm) : undefined,
      restBreaks: restBreaks ? parseInt(restBreaks) : undefined,
      recoveryTime: recoveryTime ? parseInt(recoveryTime) : undefined
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create movement log
      const newMovement = await tx.movement.create({
        data: {
          petId: petId as string,
          userId: userAuth.userId as string,
          movementType: movementType as any,
          durationMinutes: numericFields.durationMinutes || null,
          distanceMeters: numericFields.distanceMeters || null,
          activityLevel: activityLevel as any,
          location: location || null,
          indoor: indoor === 'true',
          energyBefore: (energyBefore as any) || null,
          energyAfter: (energyAfter as any) || null,
          painBefore: numericFields.painBefore || null,
          painAfter: numericFields.painAfter || null,
          gaitQuality: (gaitQuality as any) || null,
          mobility: (mobility as any) || null,
          assistance: (assistance as any) || null,
          wheelchair: wheelchair === 'true',
          harness: harness === 'true',
          leash: leash === 'true',
          enthusiasm: numericFields.enthusiasm || null,
          reluctance: reluctance === 'true',
          limping: limping === 'true',
          panting: (panting as any) || null,
          restBreaks: numericFields.restBreaks || null,
          recoveryTime: numericFields.recoveryTime || null,
          notes: notes || null,
          timeRecorded: new Date(timeRecorded)
        },
        include: {
          pet: {
            select: {
              id: true,
              name: true,
              breed: true
            }
          }
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          ...(!userAuth.user.isLegacyUser && { tokens: { decrement: movementCreateTokenCost } }),
          tokensUsed: { increment: movementCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: -movementCreateTokenCost, // Negative for debit
          type: userAuth.user.isLegacyUser ? 'MOVEMENT_CREATION_LEGACY' : 'MOVEMENT_CREATION',
          description: `Movement creation${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            movementId: newMovement.id,
            feature: 'movement_creation'
          }
        }
      })

      return { newMovement, updatedUser }
    })

    await createLog('info', 'Movement created successfully', {
      location: ['api route - POST /api/pet/movement/create-movement'],
      name: 'MovementCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      movementId: result.newMovement.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        movement: result.newMovement,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: sliceMovement
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Movement creation',
      sliceName: sliceMovement
    })
  } finally {
    await prisma.$disconnect()
  }
}
