// app/auth/error/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const AuthError = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'Verification') {
      router.replace('/auth/login?error=Verification')
    } else {
      router.replace('/auth/login')
    }
  }, [router, searchParams])

  return null // User won't see this page
}

export default AuthError
