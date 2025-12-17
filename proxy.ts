import { NextRequest, NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

// Routes that bypass authentication
const publicRoutes = ['/auth/login', '/auth/verify-request']
const cronRoutes = [
  '/api/pet/check-med-reminders',
  '/api/cron/reset-free-user-tokens',
  '/api/cron/backup',
  '/api/cron/reset-comfort-tokens'
]
const webhookRoutes = ['/api/stripe/webhook', '/api/webhooks/stripe']

export async function proxy(req: NextRequest) {
  const { nextUrl } = req

  // Allow cron jobs and webhooks to pass through
  if (
    cronRoutes.includes(nextUrl.pathname) ||
    webhookRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith('/api/media')
  ) {
    return NextResponse.next()
  }

  // Skip middleware for static files and Next.js internals
  if (
    nextUrl.pathname.startsWith('/_next') || 
    nextUrl.pathname.includes('.') || 
    nextUrl.pathname.startsWith('/icon')
  ) {
    return NextResponse.next()
  }

  const session = await auth()
  const isLoggedIn = !!session?.user

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthAPIRoute = nextUrl.pathname.startsWith('/api/auth')
  const isProtectedAPIRoute = nextUrl.pathname.startsWith('/api') && !isAuthAPIRoute
  const isProtectedPageRoute =
    nextUrl.pathname.startsWith('/guardian') ||
    nextUrl.pathname.startsWith('/admin') ||
    nextUrl.pathname.startsWith('/support') ||
    nextUrl.pathname.startsWith('/dashboard')

  // Handle page route redirects for logged in users
  if (isLoggedIn && isPublicRoute) {
    // Only redirect from login page
    if (nextUrl.pathname === '/auth/login') {
      const role = session.user.role
      const isAdmin = session.user.isAdmin
      const isSuperUser = session.user.isSuperUser

      if (role === 'admin' || isAdmin || isSuperUser) {
        return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
      }

      return NextResponse.redirect(new URL('/guardian/home', nextUrl))
    }

    // Let other public routes pass through
    return NextResponse.next()
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

  // Allow request to continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}