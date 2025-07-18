import { createLog } from '@/app/lib/api/createLog'
import prisma from '@/prisma/client'
import { slicePet } from '@/public/data/api.data'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')!
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: slicePet }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)
    const ownerId = parsedUser.id

    const body = await req.json()
    const { medicationId } = body

    // Validate required fields
    if (!medicationId) {
      return NextResponse.json({ error: 'Missing medication ID' }, { status: 400 })
    }

    // Check if medication exists and belongs to user's pet
    const existingMedication = await prisma.medication.findFirst({
      where: {
        id: medicationId,
        pet: {
          ownerId: ownerId
        }
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            ownerId: true
          }
        }
      }
    })

    if (!existingMedication) {
      return NextResponse.json({ error: 'Medication not found or unauthorized' }, { status: 404 })
    }

    // Store medication info for logging before deletion
    const medicationInfo = {
      id: existingMedication.id,
      drugName: existingMedication.drugName,
      petName: existingMedication.pet.name,
      petId: existingMedication.pet.id
    }

    // Delete medication from database
    await prisma.medication.delete({
      where: {
        id: medicationId
      }
    })

    await createLog('info', 'Medication deleted successfully', {
      location: ['api route - DELETE /api/pet/delete-medication'],
      name: 'MedicationDeleted',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      medicationId: medicationInfo.id,
      drugName: medicationInfo.drugName,
      petId: medicationInfo.petId,
      petName: medicationInfo.petName,
      ownerId
    })

    return NextResponse.json({
      medication: medicationInfo,
      success: true,
      message: `Medication "${medicationInfo.drugName}" for ${medicationInfo.petName} has been deleted`
    })
  } catch (error: any) {
    await createLog('error', `Medication deletion failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ error: 'Failed to delete medication' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
