import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceVet } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function getVet(req: NextRequest, userId?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vet: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ vet: user.vet }, { status: 201 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Get vet',
      sliceName: sliceVet
    })
  } finally {
    await prisma.$disconnect()
  }
}
