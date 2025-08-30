import { createLog } from '@/app/lib/api/createLog'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { validateTokensAndPet } from '@/app/lib/api/validateTokensAndPet'
import prisma from '@/prisma/client'
import { sliceMedication, slicePet } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const body = await req.json()

    const {
      petId,
      drugName,
      dosage,
      dosageUnit,
      frequency,
      startDate,
      endDate,
      reminderEnabled,
      reminderTimes,
      notes,
      prescribedBy,
      timezoneOffset // Add user email for sending notification
    } = body

    // Validate required fields
    if (!petId || !drugName || !dosage || !dosageUnit || !frequency || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validation = await validateTokensAndPet({
      userId: userAuth.userId!,
      petId,
      tokenCost: 0,
      actionName: 'medication create',
      req,
      user: userAuth?.user
    })

    if (!validation.success) {
      return validation.response!
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Create medication in database
        const newMedication = await tx.medication.create({
          data: {
            petId,
            drugName,
            dosage,
            dosageUnit,
            frequency,
            customFrequency: null,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            reminderEnabled: reminderEnabled || false,
            reminderTimes: reminderTimes || [],
            notes: notes || null,
            prescribedBy: prescribedBy || null,
            timezoneOffset
          },
          include: {
            pet: true // Include pet data for email
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
            type: userAuth.user.isLegacyUser ? 'MEDICATION_CREATION_LEGACY' : 'MEDICATION_CREATION',
            description: `Medication creation${userAuth.user.isLegacyUser ? ' (Usage Tracking Only)' : ''}`,
            metadata: {
              medicationId: newMedication.id,
              feature: 'medication_creation',
              dosage: newMedication.dosage,
              dosageUnit: newMedication.dosageUnit,
              drugName: newMedication.drugName
            }
          }
        })

        return { newMedication, updatedUser }
      },
      {
        timeout: 15000, // ✅ Increase to 15 seconds for atomic operations
        isolationLevel: 'ReadCommitted'
      }
    )

    await createLog('info', 'Medication created successfully', {
      location: ['api route - POST /api/pet/create-medication'],
      name: 'MedicationCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      painScoreId: result.newMedication.id,
      userId: userAuth.userId
    })

    return NextResponse.json({
      medication: result.newMedication,
      user: {
        tokens: result.updatedUser.tokens,
        tokensUsed: result.updatedUser.tokensUsed
      },
      sliceName: slicePet
    })
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Medication created',
      sliceName: sliceMedication
    })
  } finally {
    await prisma.$disconnect()
  }
}
