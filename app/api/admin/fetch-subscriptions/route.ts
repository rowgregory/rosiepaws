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

    const subscriptions = await prisma.stripeSubscription.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true
      }
    })

    return NextResponse.json({ subscriptions, sliceName: sliceStripe }, { status: 200 })
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
