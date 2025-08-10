import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceVet } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function updateVet(req: NextRequest, userId?: string) {
  try {
    const { vetName, clinicName, phone, emergencyPhone, email, website, address, hours, notes } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vet: true }
    })

    if (!user?.vet) {
      return NextResponse.json({ error: 'No vet profile found' }, { status: 404 })
    }

    const updatedVet = await prisma.vet.update({
      where: { id: user.vet.id },
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

    return NextResponse.json({ success: true, vet: updatedVet }, { status: 200 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Update vet',
      sliceName: sliceVet
    })
  } finally {
    await prisma.$disconnect()
  }
}
