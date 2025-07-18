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

  // Skip middleware for API routes (except auth), static files, and Next.js internals
  if (
    (nextUrl.pathname.startsWith('/api') && !nextUrl.pathname.startsWith('/api/auth')) ||
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
      id: token.sub || token.id,
      email: token.email,
      name: token.name,
      role: token.role,
      isAdmin: token.isAdmin
    }
    requestHeaders.set('x-user', JSON.stringify(userData))
  }

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isProtectedRoute = nextUrl.pathname.startsWith('/guardian') || nextUrl.pathname.startsWith('/admin')

  if (isLoggedIn && isPublicRoute) {
    const role = token?.role
    const isAdmin = token?.isAdmin

    // Temporary logging for production debugging
    console.log('🔍 Redirect logic:', { role, isAdmin, pathname: nextUrl.pathname })

    if (role === 'admin' && isAdmin) {
      console.log('🔄 Redirecting admin to dashboard')
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    }

    console.log('🔄 Redirecting regular user to guardian home')
    return NextResponse.redirect(new URL('/guardian/home', nextUrl))
  }

  // Redirect unauthenticated users from protected routes
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Continue with headers
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
