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
  user?: any
}

interface ValidationResult {
  success: boolean
  response?: NextResponse
  owner?: any
  pet?: any
}

export async function validateTokensAndPet({
  userId,
  petId,
  tokenCost,
  actionName,
  req,
  user
}: ValidationOptions): Promise<ValidationResult> {
  try {
    // Check token balance
    if (user.tokens < tokenCost) {
      await createLog('warning', `Insufficient tokens for ${actionName}`, {
        location: [`api route - ${req.method} ${req.url}`],
        name: 'InsufficientTokens',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        userId,
        requiredTokens: tokenCost,
        availableTokens: user.tokens
      })
      return {
        success: false,
        response: NextResponse.json(
          {
            message: `Insufficient tokens. Required: ${tokenCost}, Available: ${user.tokens}`,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await createLog('error', `Database error during ${actionName} validation`, {
      location: [`api route - ${req.method} ${req.url}`],
      name: 'DatabaseError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      userId,
      petId,
      error: errorMessage,
      user
    })

    return {
      success: false,
      response: NextResponse.json(
        { message: 'Internal server error', error: errorMessage, sliceName: slicePet },
        { status: 500 }
      )
    }
  }
}
