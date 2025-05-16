import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import argon2 from 'argon2'
import { SignJWT } from 'jose'
import { createLog } from '@/app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    await createLog('warning', 'Missing email or password during login attempt', {
      location: ['auth route - POST /api/auth/login'],
      name: 'MissingCredentials',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email
    })

    return NextResponse.json({ message: 'Missing required fields', sliceName: 'authApi' }, { status: 404 })
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (!existingUser) {
      await createLog('warning', 'User not found during login', {
        location: ['auth route - POST /api/auth/login'],
        name: 'UserNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })

      return NextResponse.json({ message: 'User not found', sliceName: 'authApi' }, { status: 404 })
    }

    const isPasswordValid = await argon2.verify(existingUser.password, password)

    if (!isPasswordValid) {
      await createLog('warning', 'Invalid password attempt', {
        location: ['auth route - POST /api/auth/login'],
        name: 'InvalidPassword',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })

      return NextResponse.json({ message: 'Invalid password', sliceName: 'authApi' }, { status: 401 })
    }

    const payload = {
      isAuthenticated: true,
      id: existingUser.id
    }

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    const response = NextResponse.json(payload, { status: 200 })

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60, // 1 day
      path: '/' // Cookie applies to the entire domain
    })

    await createLog('info', 'User successfully logged in', {
      location: ['auth route - POST /api/auth/login'],
      name: 'LoginSuccess',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email
    })

    return response
  } catch (error: any) {
    await createLog('error', `Login failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email
    })

    return NextResponse.json({ message: 'Something went wrong', sliceName: 'authApi' }, { status: 500 })
  }
}
