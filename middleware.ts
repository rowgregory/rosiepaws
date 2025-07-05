import { NextRequest, NextResponse } from 'next/server'

// Define auth routes that should redirect if already authenticated
const authRoutes = ['/auth/login', '/auth/register']

// Define admin routes that require admin privileges
const adminRoutes = ['/admin/dashboard']

// Define guardian routes for regular users
const guardianRoutes = ['/guardian/dashboard']

// Define protected routes that require authentication
const protectedRoutes = ['/admin/dashboard', '/guardian/dashboard']

export function middleware(req: NextRequest) {
  const { nextUrl } = req

  // Check for NextAuth session token
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value || req.cookies.get('__Secure-authjs.session-token')?.value
  const isLoggedIn = !!sessionToken

  console.log('🔍 Middleware check:', {
    path: nextUrl.pathname,
    isLoggedIn,
    hasSessionToken: !!sessionToken
  })

  // Check if current path is an API route (skip middleware for API routes except auth)
  if (nextUrl.pathname.startsWith('/api') && !nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Check if current path is a static file or Next.js internal route
  if (
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.includes('.') ||
    nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Helper function to check if path matches any route pattern
  const isRouteMatch = (routes: string[], path: string) => {
    return routes.some((route) => {
      if (route.endsWith('*')) {
        // Wildcard match
        return path.startsWith(route.slice(0, -1))
      }
      return path === route || path.startsWith(route + '/')
    })
  }

  const isAuthRoute = isRouteMatch(authRoutes, nextUrl.pathname)
  const isAdminRoute = isRouteMatch(adminRoutes, nextUrl.pathname)
  const isGuardianRoute = isRouteMatch(guardianRoutes, nextUrl.pathname)
  const isProtectedRoute = isRouteMatch(protectedRoutes, nextUrl.pathname)

  // If user is logged in and trying to access auth pages, redirect to guardian dashboard
  // (we can't determine admin status from cookie alone, so default to guardian)
  if (isLoggedIn && isAuthRoute) {
    console.log('🔄 Redirecting authenticated user away from auth page')
    return NextResponse.redirect(new URL('/guardian/dashboard', nextUrl))
  }

  // If user is not logged in and trying to access protected routes
  if (!isLoggedIn && (isProtectedRoute || isAdminRoute || isGuardianRoute)) {
    console.log('🚫 Redirecting unauthenticated user to login')
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to guardian dashboard when accessing root protected paths
  // (admin role checking will need to happen at the page level)
  if (
    isLoggedIn &&
    (nextUrl.pathname === '/dashboard' || nextUrl.pathname === '/admin' || nextUrl.pathname === '/guardian')
  ) {
    console.log('🔄 Redirecting to guardian dashboard (role check at page level)')
    return NextResponse.redirect(new URL('/guardian/dashboard', nextUrl))
  }

  console.log('✅ Middleware allowing access to:', nextUrl.pathname)
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
