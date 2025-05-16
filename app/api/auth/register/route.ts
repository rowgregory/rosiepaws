import prisma from '@/prisma/client'
import { NextResponse } from 'next/server'
import argon2 from 'argon2'
import { createLog } from '@/app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'

const hashData = async (data: string): Promise<string> => {
  return argon2.hash(data)
}

export async function POST(req: Request) {
  const body = await req.json()

  try {
    const { firstName, lastName, email, password, securityQuestion, securityAnswer } = body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      await createLog('error', 'Existing user in registration', {
        errorLocation: ['register route - POST /api/auth/register - email uniqueness check'],
        errorMessage: `Email already in use: ${email}`,
        errorName: 'EmailAlreadyInUseError',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        user: { firstName, lastName, email }
      })

      return NextResponse.json({ message: 'Email already in use', sliceName: sliceAuth }, { status: 409 })
    }

    const hashedPassword = await hashData(password)
    const hashedSecurityAnswer = await hashData(securityAnswer)

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin: true,
        role: 'admin',
        securityQuestion,
        securityAnswerHash: hashedSecurityAnswer
      }
    })

    await createLog('info', 'New account created', {
      location: ['register route - POST /api/auth/register'],
      message: `Account successfully created for: ${email}`,
      name: 'AccountCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      user: { firstName, lastName, email }
    })

    return NextResponse.json({ sliceName: sliceAuth }, { status: 201 })
  } catch (error: any) {
    await createLog('error', `Registration failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      user: { firstName: body?.firstName, lastName: body?.lastName, email: body?.email }
    })
    return NextResponse.json({ message: 'Registration failed', error, sliceName: sliceAuth }, { status: 500 })
  }
}
