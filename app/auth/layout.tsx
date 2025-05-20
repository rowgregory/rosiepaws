import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { ChildrenProps } from '@/app/types/common.types'

export default async function LoginLayout({ children }: ChildrenProps) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('authToken')?.value

  if (token) {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))

    const role = payload.role
    const isAdmin = payload.isAdmin

    if (role === 'admin' && isAdmin) {
      redirect('/admin/dashboard')
    }

    redirect('/guardian/dashboard')
  }

  return <>{children}</>
}
