import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Routes that bypass authentication
const publicRoutes = ['/auth/login']
const cronRoutes = ['/api/pet/check-med-reminders']

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  // Allow cron jobs to pass through
  if (cronRoutes.includes(nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Skip middleware for static files and Next.js internals only
  if (
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.includes('.') ||
    nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  const isLoggedIn = !!token

  // Set up request headers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', nextUrl.pathname)
  if (token) {
    const userData = {
      id: token.userId,
      email: token.email,
      name: token.name,
      firstName: token.firstName,
      lastName: token.lastName,
      role: token.role,
      isAdmin: token.isAdmin,
      isGuardian: token.isGuardian,
      isFreeUser: token.isFreeUser,
      isComfortUser: token.isComfortUser,
      isCompanionUser: token.isCompanionUser,
      isLegacyUser: token.isLegacyUser
    }
    requestHeaders.set('x-user', JSON.stringify(userData))
  }

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthAPIRoute = nextUrl.pathname.startsWith('/api/auth')
  const isProtectedAPIRoute = nextUrl.pathname.startsWith('/api') && !isAuthAPIRoute
  const isProtectedPageRoute = nextUrl.pathname.startsWith('/guardian') || nextUrl.pathname.startsWith('/admin')

  // Handle page route redirects for logged in users
  if (isLoggedIn && isPublicRoute) {
    const role = token?.role
    const isAdmin = token?.isAdmin

    if (role === 'admin' || isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    }

    return NextResponse.redirect(new URL('/guardian/home', nextUrl))
  }

  // Protect API routes - require authentication
  if (isProtectedAPIRoute && !isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Protect page routes - redirect to login
  if (isProtectedPageRoute && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Continue with headers for all routes
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}
