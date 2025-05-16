import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import argon2 from 'argon2'
import { createLog } from '@/app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'

const sliceName = 'authApi'

export async function PATCH(req: NextRequest) {
  const { userId, password } = await req.json()

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ message: 'User not found', sliceName }, { status: 404 })
    }

    const hashedPassword = await argon2.hash(password)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ passwordReset: true, sliceName }, { status: 200 })
  } catch (error: any) {
    await createLog('error', `Reset password failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      userId
    })
    return NextResponse.json({ message: 'Password reset failed', error, sliceName }, { status: 500 })
  }
}
