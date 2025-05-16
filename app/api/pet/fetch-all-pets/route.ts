import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { createLog } from '@/app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'

export async function GET(req: NextRequest) {
  try {
    const userHeader = req.headers.get('x-user')
    if (!userHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing user header', sliceName: sliceAuth }, { status: 401 })
    }
    const parsedUser = JSON.parse(userHeader)

    if (!parsedUser.isAdmin) {
      return NextResponse.json({ message: 'Forbidden: Admins only', sliceName: sliceAuth }, { status: 403 })
    }

    const pets = await prisma.pet.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ pets, sliceName: sliceAuth }, { status: 200 })
  } catch (error: any) {
    await createLog('error', `Fetch all pets failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Fetch all pets failed', error, sliceName: sliceAuth }, { status: 500 })
  }
}
