import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAdmin } from '@/app/lib/auth/getServerSession'
import { pusher } from '@/app/lib/pusher/pusher'
import prisma from '@/prisma/client'
import { sliceAdmin } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin()

    const { userId, tier } = await req.json()

    // Validate tier
    if (!['Free', 'Comfort', 'Legacy'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Update tier
    const isFreeUser = tier === 'Free'
    const isComfortUser = tier === 'Comfort'
    const isLegacyUser = tier === 'Legacy'

    // Update user with new tier
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: tier,
        isFreeUser,
        isComfortUser,
        isLegacyUser
      }
    })

    await pusher.trigger(`user-${userId}`, 'tier-updated', {
      tier,
      isFreeUser,
      isComfortUser,
      isLegacyUser
    })

    await createLog('info', 'User tier updated successfully', {
      location: ['api route - PATCH /api/admin/update-user-tier'],
      name: 'UserTierUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      adminUserId: userId,
      adminEmail: session.user.email
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Update user tier',
      sliceName: sliceAdmin
    })
  }
}
