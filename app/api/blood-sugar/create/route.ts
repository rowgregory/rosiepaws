import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { slicePet } from '@/public/data/api.data'
import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import { handleApiError } from '@/app/lib/api/handleApiError'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const { petId, value, timeRecorded, notes, mealRelation, measurementUnit, targetRange, symptoms, medicationGiven } =
      await req.json()

    if (!petId || !value || !timeRecorded) {
      return NextResponse.json(
        {
          message: `Missing required fields: petId: ${petId}, value: ${value}, timeRecorded: ${timeRecorded} are required`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    const validation = await validateTokensAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: 0,
      actionName: 'blood sugar',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create Blood Sugar entry
      const newBloodSugar = await tx.bloodSugar.create({
        data: {
          petId,
          value,
          timeRecorded,
          notes,
          mealRelation,
          measurementUnit,
          targetRange,
          symptoms,
          medicationGiven
        },
        include: {
          pet: true // Optional: attach pet info like name
        }
      })

      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userAuth.userId },
        data: {
          ...(!userAuth.user.isLegacyUser && { tokens: { decrement: 0 } }),
          tokensUsed: { increment: 0 }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: userAuth.userId!,
          amount: 0, // Negative for debit
          type: userAuth.user.isLegacyUser ? 'BLOOD_SUGAR_CREATION_LEGACY' : 'BLOOD_SUGAR_CREATION',
          description: `Blood sugar creation${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
          metadata: {
            bloodSugarId: newBloodSugar.id,
            feature: 'blood_sugar_creation'
          }
        }
      })

      return { newBloodSugar, updatedUser }
    })

    await createLog('info', 'Blood sugar created successfully', {
      location: ['api route - POST /api/pet/create-blood-sugar'],
      name: 'BloodSugarCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      bloodSugarId: result.newBloodSugar.id,
      userId: userAuth.userId
    })

    return NextResponse.json(
      {
        bloodSugar: result.newBloodSugar,
        user: {
          tokens: result.updatedUser.tokens,
          tokensUsed: result.updatedUser.tokensUsed
        },
        sliceName: slicePet
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Blood sugar creation',
      sliceName: slicePet
    })
  } finally {
    await prisma.$disconnect()
  }
}
