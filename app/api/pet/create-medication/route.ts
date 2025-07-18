import { createLog } from '@/app/lib/api/createLog'
import { medicationCreateTokenCost } from '@/app/lib/constants/token'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

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

    // Confirm owner exists (optional since user is logged in, but good safety)
    const owner = await prisma.user.findUnique({ where: { id: ownerId } })
    if (!owner) {
      await createLog('warning', 'Owner user not found when creating medication', {
        location: ['api route - POST /api/pet/create-medication'],
        name: 'OwnerNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ownerId
      })
      return NextResponse.json({ message: 'Owner not found', sliceName: slicePet }, { status: 404 })
    }

    if (owner.tokens < medicationCreateTokenCost) {
      await createLog('warning', 'Insufficient tokens for medication creation', {
        location: ['api route - POST /api/pet/create-medication'],
        name: 'InsufficientTokens',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ownerId,
        requiredTokens: medicationCreateTokenCost,
        availableTokens: owner.tokens
      })
      return NextResponse.json(
        {
          message: `Insufficient tokens. Required: ${medicationCreateTokenCost}, Available: ${owner.tokens}`,
          sliceName: slicePet
        },
        { status: 400 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
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
        where: { id: ownerId },
        data: {
          tokens: { decrement: medicationCreateTokenCost },
          tokensUsed: { increment: medicationCreateTokenCost }
        }
      })

      // Create token transaction record
      await tx.tokenTransaction.create({
        data: {
          userId: ownerId,
          amount: -medicationCreateTokenCost, // Negative for debit
          type: 'MEDICATION_CREATION',
          description: `Medication creation`,
          metadata: {
            medicationId: newMedication.id,
            feature: 'medication_creation'
          }
        }
      })

      return { newMedication, updatedUser }
    })

    await createLog('info', 'Medication created successfully', {
      location: ['api route - POST /api/pet/create-medication'],
      name: 'MedicationCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      petId,
      painScoreId: result.newMedication.id,
      ownerId
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
    await createLog('error', `Medication creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
