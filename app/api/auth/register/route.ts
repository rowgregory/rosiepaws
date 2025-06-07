import prisma from '@/prisma/client'
import { NextResponse } from 'next/server'
import argon2 from 'argon2'
import { createLog } from '@/app/lib/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'
import { SignJWT } from 'jose'

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
    const ADMIN_USER_EMAIL = process.env.ADMIN_USER
    const PREMIUM_USER_EMAIL = process.env.PREMIUM_USER
    const BASIC_USER_EMAIL = process.env.BASIC_USER

    let role = 'basic_user'
    let isAdmin = false
    let isSuperUser = false

    if (email === ADMIN_USER_EMAIL) {
      role = 'admin'
      isAdmin = true
      isSuperUser = true
    } else if (email === PREMIUM_USER_EMAIL) {
      role = 'premium_user'
    } else if (email === BASIC_USER_EMAIL) {
      role = 'basic_user'
    }

    const hashedPassword = await hashData(password)
    const hashedSecurityAnswer = await hashData(securityAnswer)

    const createdUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin,
        isSuperUser,
        role,
        securityQuestion,
        securityAnswerHash: hashedSecurityAnswer
      }
    })

    const payload = {
      isAuthenticated: true,
      id: createdUser.id,
      role: createdUser.role,
      isAdmin: createdUser.isAdmin,
      isSuperUser: createdUser.isSuperUser
    }

    // Sign the JWT
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    // Create response and set cookie
    const response = NextResponse.json({ payload, sliceName: sliceAuth }, { status: 201 })
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60, // 1 day
      path: '/'
    })

    await createLog('info', 'New account created', {
      location: ['register route - POST /api/auth/register'],
      message: `Account successfully created for: ${email} with role ${role}`,
      name: 'AccountCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      user: { firstName, lastName, email }
    })

    return response
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
