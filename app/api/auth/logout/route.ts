import { NextRequest, NextResponse } from 'next/server'
import { createLog } from '@/app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: new Date(0),
      path: '/'
    }

    const response = NextResponse.json({ sliceName: sliceAuth }, { status: 200 })

    response.cookies.set('authToken', '', cookieOptions)

    return response
  } catch (error: any) {
    await createLog('error', `Logout failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      userId: body.id
    })

    return NextResponse.json(
      {
        message: 'Failed to logout',
        sliceName: sliceAuth
      },
      { status: 500 }
    )
  }
}
