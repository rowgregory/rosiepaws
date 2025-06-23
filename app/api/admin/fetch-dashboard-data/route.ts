import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { createLog } from '@/app/lib/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceStripe } from '@/public/data/api.data'

export async function GET(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')
    if (!userHeader) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing user header', sliceName: sliceStripe },
        { status: 401 }
      )
    }
    const parsedUser = JSON.parse(userHeader)

    if (!parsedUser.isAdmin) {
      return NextResponse.json({ message: 'Forbidden: Admins only', sliceName: sliceStripe }, { status: 403 })
    }

    const now = new Date()

    const subscriptions = await prisma.stripeSubscription.findMany({
      where: {
        status: 'active', // or 'paid' depending on your status logic
        trialEndsAt: {
          lt: now // trial has ended
        },
        planPrice: { gt: 0 }
      },
      select: {
        planPrice: true,
        createdAt: true
      }
    })

    const byMonth: Record<string, number> = {}

    for (const sub of subscriptions) {
      const date = new Date(sub.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!byMonth[key]) byMonth[key] = 0
      byMonth[key] += sub.planPrice
    }

    const result = Object.entries(byMonth).map(([month, cents]) => ({
      month,
      grossVolumeUSD: (cents / 100).toFixed(2)
    }))

    const users = await prisma.user.findMany()

    return NextResponse.json({ grossVolumeByMonth: result, users, sliceName: sliceStripe }, { status: 200 })
  } catch (error: any) {
    await createLog('error', `Fetch all subscriptions failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json(
      { message: 'Fetch all subscriptions failed', error, sliceName: sliceStripe },
      { status: 500 }
    )
  }
}
