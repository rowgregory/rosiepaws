import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

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

const guardianPagePaths = ['/guardian']

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

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const pathname = url.pathname

  const token = req.cookies.get('authToken')?.value

  if (!token) {
    // Redirect to login for admin pages, guardian pages, or admin API
    if (
      adminPagePaths.some((path) => pathname.startsWith(path)) ||
      guardianPagePaths.some((path) => pathname.startsWith(path)) ||
      adminApiPaths.some((path) => pathname.startsWith(path))
    ) {
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))

    const role = (payload.role as string) || ''

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user', JSON.stringify(payload))

    const res = NextResponse.next({
      request: { headers: requestHeaders }
    })

    if (role === 'admin') {
      return res
    }

    // Authenticated but non-admin user
    if (adminPagePaths.some((path) => pathname.startsWith(path))) {
      url.pathname = '/guardian/dashboard'
      return NextResponse.redirect(url)
    }

    if (adminApiPaths.some((path) => pathname.startsWith(path))) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return res
  } catch {
    // Token invalid or expired — treat as unauthenticated
    if (
      adminPagePaths.some((path) => pathname.startsWith(path)) ||
      guardianPagePaths.some((path) => pathname.startsWith(path)) ||
      adminApiPaths.some((path) => pathname.startsWith(path))
    ) {
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/guardian/:path*', '/api/:path*']
}
