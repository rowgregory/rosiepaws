import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

const adminPagePaths = [
  '/admin',
  '/admin/dashboard',
  '/admin/blog',
  '/admin/journal',
  '/admin/newsletter',
  '/admin/pets',
  '/admin/subscriptions',
  '/admin/users'
]

// const guardianPagePaths = ['/guardian']

const adminApiPaths = [
  '/api/pet/fetch-pets',
  '/api/user/fetch-users',
  '/api/user/update-user',
  '/api/user/delete-user',
  '/api/blog/create-blog',
  '/api/blog/update-blog',
  '/api/blog/delete-blog',
  '/api/journal/create-journal',
  '/api/journal/update-journal',
  '/api/journal/delete-journal',
  '/api/newsletter/delete-newsletter',
  '/api/subscription/fetch-subscriptions'
]

export default auth((req) => {
  const session = req.auth as any
  const { pathname } = req.nextUrl

  console.log('Session:', session)
  console.log('Current path:', pathname)

  if (!session) {
    if (needsAuth(pathname)) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    return NextResponse.next()
  }

  // Extract user data from session
  const isAdmin = session.isAdmin as boolean
  const role = session.role as string

  console.log('User role:', role, 'isAdmin:', isAdmin)

  // If user is admin and not already on an admin page, redirect to admin dashboard
  if (isAdmin && role === 'admin') {
    if (!adminPagePaths.some((path) => pathname.startsWith(path))) {
      console.log('Redirecting admin to dashboard')
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  }

  // Non-admin trying to access admin pages
  if (adminPagePaths.some((path) => pathname.startsWith(path))) {
    if (!isAdmin || role !== 'admin') {
      return NextResponse.redirect(new URL('/guardian/dashboard', req.url))
    }
  }

  // Non-admin trying to access admin APIs
  if (adminApiPaths.some((path) => pathname.startsWith(path))) {
    if (!isAdmin || role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  return NextResponse.next()
})

function needsAuth(pathname: string): boolean {
  const protectedPaths = ['/admin', '/guardian']
  return protectedPaths.some((path) => pathname.startsWith(path))
}

export const config = {
  matcher: ['/admin/:path*', '/guardian/:path*', '/api/:path*']
}
