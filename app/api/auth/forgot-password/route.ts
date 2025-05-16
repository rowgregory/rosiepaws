import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import argon2 from 'argon2'
import { createLog } from '@/app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'

export async function POST(req: NextRequest) {
  const { email, securityQuestion, securityAnswer } = await req.json()

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      await createLog('warning', 'User not found during forgot password attempt', {
        location: ['auth route - POST /api/auth/forgot-password'],
        name: 'UserNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })
      return NextResponse.json({ message: 'User not found', sliceName: sliceAuth }, { status: 404 })
    }

    if (user.securityQuestion !== securityQuestion) {
      await createLog('warning', 'Security question mismatch during forgot password attempt', {
        location: ['auth route - POST /api/auth/forgot-password'],
        name: 'SecurityQuestionMismatch',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })
      return NextResponse.json({ message: 'Security question does not match', sliceName: sliceAuth }, { status: 400 })
    }

    const isAnswerValid = await argon2.verify(user.securityAnswerHash, securityAnswer)
    if (!isAnswerValid) {
      await createLog('warning', 'Incorrect security answer during forgot password attempt', {
        location: ['auth route - POST /api/auth/forgot-password'],
        name: 'IncorrectSecurityAnswer',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })
      return NextResponse.json({ message: 'Security answer is incorrect', sliceName: sliceAuth }, { status: 400 })
    }

    await createLog('info', 'User passed security check for forgot password', {
      location: ['auth route - POST /api/auth/forgot-password'],
      name: 'ForgotPasswordPassed',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email
    })

    return NextResponse.json({ id: user.id, sliceName: sliceAuth }, { status: 200 })
  } catch (error: any) {
    await createLog('error', `Forgot password failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email
    })
    return NextResponse.json({ message: 'Forgot password failed', error, sliceName: sliceAuth }, { status: 500 })
  }
}
