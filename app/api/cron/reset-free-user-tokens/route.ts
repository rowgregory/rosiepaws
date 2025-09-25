import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceUser } from '@/public/data/api.data'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const result = await prisma.user.updateMany({
      where: {
        isFreeUser: true
      },
      data: {
        tokens: 250
      }
    })

    await createLog('info', `Reset tokens for ${result.count} free users`, {
      location: ['api route - GET /api/cron/reset-free-user-tokens'],
      name: 'ResetTokensForFreeUsers',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return Response.json({
      success: true,
      message: `Reset tokens for ${result.count} free users`,
      count: result.count
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Reset tokens for free user',
      sliceName: sliceUser
    })
  } finally {
    await prisma.$disconnect()
  }
}
