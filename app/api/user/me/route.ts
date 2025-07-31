import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceUser } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const user = await prisma.user.findMany({
      where: {
        id: userAuth.userId
      },
      select: {
        id: true,
        role: true,
        isSuperUser: true,
        isAdmin: true,
        isComfortUser: true,
        isCompanionUser: true,
        isLegacyUser: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
        tokens: true,
        tokensUsed: true,
        image: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'List my data',
      sliceName: sliceUser
    })
  } finally {
    await prisma.$disconnect()
  }
}
