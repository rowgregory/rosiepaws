import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceVet } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function createVet(req: NextRequest, userId?: string) {
  try {
    const {
      vetData: { vetName, clinicName, phone, emergencyPhone, email, website, address, hours, notes }
    } = await req.json()

    // Create vet and link to user in one transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the vet record
      const vet = await tx.vet.create({
        data: {
          vetName,
          clinicName,
          phone,
          emergencyPhone,
          email,
          website,
          address,
          hours,
          notes
        }
      })

      // Link vet to user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { vetId: vet.id },
        include: { vet: true }
      })

      return { updatedUser, vet }
    })

    await createLog('info', 'Vet created and linked to user successfully', {
      location: ['api route - POST /api/vet'],
      name: 'VetCreatedAndLinkedToUser',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      vetId: result.vet.id,
      vetName: result.vet.vetName,
      userId: userId
    })

    return NextResponse.json({ user: result.updatedUser }, { status: 201 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Create vet',
      sliceName: sliceVet
    })
  } finally {
    await prisma.$disconnect()
  }
}
