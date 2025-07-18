import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Define admin routes that require admin privileges
const adminRoutes = ['/admin/dashboard']

// Define guardian routes for regular users
const guardianRoutes = ['/guardian/dashboard']

// Define protected routes that require authentication
const protectedRoutes = ['/admin', '/guardian']

// Define cron job routes that should bypass authentication
const cronRoutes = ['/api/pet/check-med-reminders']

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  // Check if this is a cron job route - allow it to pass through immediately
  if (cronRoutes.includes(nextUrl.pathname)) {
    console.log('🤖 Allowing cron job to proceed:', nextUrl.pathname)
    return NextResponse.next()
  }

  // Get the decoded token from NextAuth
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  const isLoggedIn = !!token

  // console.log('🔍 Middleware check:', {
  //   path: nextUrl.pathname,
  //   isLoggedIn,
  //   userId: token?.sub || token?.id
  // })

  // Set up request headers with user data
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', nextUrl.pathname)
  if (token) {
    // Include the user data you need - adjust based on what's in your token
    const userData = {
      id: token.sub || token.id, // NextAuth typically uses 'sub' for user ID
      email: token.email,
      name: token.name
      // Add other fields you need from the token
    }
    requestHeaders.set('x-user', JSON.stringify(userData))
  }

  if (nextUrl.pathname === '/auth/custom-callback') {
    console.log('✅ Allowing auth callback to proceed')
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  }

  // Check if current path is an API route (skip middleware for API routes except auth)
  if (nextUrl.pathname.startsWith('/api') && !nextUrl.pathname.startsWith('/api/auth')) {
    // For API routes, pass through with headers
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
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

  const isAuthRoute = nextUrl.pathname === '/auth/login'
  const isAdminRoute = isRouteMatch(adminRoutes, nextUrl.pathname)
  const isGuardianRoute = isRouteMatch(guardianRoutes, nextUrl.pathname)
  const isProtectedRoute = isRouteMatch(protectedRoutes, nextUrl.pathname)

  // If user is logged in and trying to access auth pages, redirect to guardian dashboard
  if (isLoggedIn && isAuthRoute) {
    console.log('🔄 Redirecting authenticated user away from auth page')
    return NextResponse.redirect(new URL('/guardian/home', nextUrl))
  }

  // If user is not logged in and trying to access protected routes
  if (!isLoggedIn && (isProtectedRoute || isAdminRoute || isGuardianRoute)) {
    console.log('🚫 Redirecting unauthenticated user to login')
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to guardian dashboard when accessing root protected paths
  if (
    isLoggedIn &&
    (nextUrl.pathname === '/dashboard' || nextUrl.pathname === '/admin' || nextUrl.pathname === '/guardian')
  ) {
    console.log('🔄 Redirecting to guardian dashboard (role check at page level)')
    return NextResponse.redirect(new URL('/guardian/home', nextUrl))
  }

  // console.log('✅ Middleware allowing access to:', nextUrl.pathname)
  // For all other routes, pass through with headers
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
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
