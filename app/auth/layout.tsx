import { headers } from 'next/headers'
import { ChildrenProps } from '../types/common'
import { auth } from '../lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginLayout({ children }: ChildrenProps) {
  const session = await auth()
  const headersList = headers()
  const pathname = (await headersList).get('x-pathname') || (await headersList).get('x-invoke-path') || ''

  // Only redirect if user is logged in AND trying to access the login page
  if (session?.user && pathname === '/auth/login') {
    const role = session.user.role
    const isAdmin = session.user.isAdmin

    if (role === 'admin' && isAdmin) {
      redirect('/admin/dashboard')
    }

    redirect('/guardian/home')
  }

  return <>{children}</>
}
