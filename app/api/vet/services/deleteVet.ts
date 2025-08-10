import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceVet } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function deleteVet(req: NextRequest, userId?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vet: true }
    })

    if (!user?.vet) {
      return NextResponse.json({ error: 'No vet profile found' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { vetId: null }
      })

      await tx.vet.delete({
        where: { id: user?.vet?.id }
      })
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Delete vet',
      sliceName: sliceVet
    })
  } finally {
    await prisma.$disconnect()
  }
}
