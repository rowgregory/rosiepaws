import { NextRequest, NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

// Routes that bypass authentication
const publicRoutes = ['/auth/login', '/auth/custom-callback']
const cronRoutes = ['/api/pet/check-med-reminders']

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  // Allow cron jobs to pass through
  if (cronRoutes.includes(nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Skip middleware for static files and Next.js internals only
  if (nextUrl.pathname.startsWith('/_next') || nextUrl.pathname.includes('.') || nextUrl.pathname.startsWith('/icon')) {
    return NextResponse.next()
  }

  const session = await auth()
  const isLoggedIn = !!session?.user

  // Set up request headers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', nextUrl.pathname)
  if (session?.user) {
    const userData = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
      isAdmin: session.user.isAdmin,
      isFreeUser: session.user.isFreeUser,
      isComfortUser: session.user.isComfortUser,
      isLegacyUser: session.user.isLegacyUser
    }
    requestHeaders.set('x-user', JSON.stringify(userData))
  }

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthAPIRoute = nextUrl.pathname.startsWith('/api/auth')
  const isProtectedAPIRoute = nextUrl.pathname.startsWith('/api') && !isAuthAPIRoute
  const isProtectedPageRoute =
    nextUrl.pathname.startsWith('/guardian') ||
    nextUrl.pathname.startsWith('/admin') ||
    nextUrl.pathname.startsWith('/support')

  // Handle page route redirects for logged in users
  if (isLoggedIn && isPublicRoute) {
    // Only redirect from login page, not from custom callback
    if (nextUrl.pathname === '/auth/login') {
      const role = session.user.role
      const isAdmin = session.user.isAdmin

      if (role === 'admin' || isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
      }

      return NextResponse.redirect(new URL('/guardian/home', nextUrl))
    }

    // Let custom callback handle its own routing
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
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

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
