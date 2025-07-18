import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { createLog } from './createLog'
import { slicePet } from '@/public/data/api.data'

interface ValidationOptions {
  userId: string
  petId: string
  tokenCost: number
  actionName: string
  req: NextRequest
}

interface ValidationResult {
  success: boolean
  response?: NextResponse
  owner?: any
  pet?: any
}

export async function validateOwnerAndPet({
  userId,
  petId,
  tokenCost,
  actionName,
  req
}: ValidationOptions): Promise<ValidationResult> {
  try {
    // Confirm owner exists
    const owner = await prisma.user.findUnique({ where: { id: userId } })
    if (!owner) {
      await createLog('warning', `Owner user not found when creating ${actionName}`, {
        location: [`api route - ${req.method} ${req.url}`],
        name: 'OwnerNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        userId
      })
      return {
        success: false,
        response: NextResponse.json({ message: 'Owner not found', sliceName: slicePet }, { status: 404 })
      }
    }

    // Check token balance
    if (owner.tokens < tokenCost) {
      await createLog('warning', `Insufficient tokens for ${actionName}`, {
        location: [`api route - ${req.method} ${req.url}`],
        name: 'InsufficientTokens',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        userId,
        requiredTokens: tokenCost,
        availableTokens: owner.tokens
      })
      return {
        success: false,
        response: NextResponse.json(
          {
            message: `Insufficient tokens. Required: ${tokenCost}, Available: ${owner.tokens}`,
            sliceName: slicePet
          },
          { status: 400 }
        )
      }
    }

    // Confirm pet exists
    const pet = await prisma.pet.findUnique({ where: { id: petId } })
    if (!pet) {
      await createLog('warning', `Pet not found when creating ${actionName}`, {
        location: [`api route - ${req.method} ${req.url}`],
        name: 'PetNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        petId,
        userId
      })
      return {
        success: false,
        response: NextResponse.json({ message: 'Pet not found', sliceName: slicePet }, { status: 404 })
      }
    }

    // All validations passed
    return {
      success: true
    }
  } catch (error) {
    await createLog('error', `Database error during ${actionName} validation`, {
      location: [`api route - ${req.method} ${req.url}`],
      name: 'DatabaseError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      userId,
      petId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      response: NextResponse.json({ message: 'Internal server error', sliceName: slicePet }, { status: 500 })
    }
  }
}
