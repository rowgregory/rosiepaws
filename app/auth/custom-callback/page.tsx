'use client'

import { setAuthState } from '@/app/redux/features/authSlice'
import { setPet, setPets } from '@/app/redux/features/petSlice'
import { setUser } from '@/app/redux/features/userSlice'
import { useAppDispatch } from '@/app/redux/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const CustomCallback = () => {
  const { data: session, status } = useSession()
  const { push } = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handlePostAuth = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          dispatch(
            setUser({
              id: session.user.id,
              email: session.user.email,
              firstName: session.user.firstName,
              lastName: session.user.lastName,
              role: session.user.role,
              hasSubscription: !!session.user.stripeSubscription,
              isAdmin: session.user.isAdmin,
              isGuardian: session.user.isGuardian,
              isFreeUser: session.user.isFreeUser,
              isComfortUser: session.user.isComfortUser,
              isCompanionUser: session.user.isCompanionUser,
              isLegacyUser: session.user.isLegacyUser,
              pets: session.user.pets
            })
          )

          dispatch(
            setAuthState({
              isAuthenticated: true,
              id: session.user.id,
              role: session.user.role || ''
            })
          )

          dispatch(setPets(session.user.pets))
          dispatch(setPet(session.user.pets?.[0]))

          // Route based on user type with clearer priority
          if ((session.user.isAdmin || session.user.isSuperUser) && session.user.role === 'ADMIN') {
            push('/admin/dashboard')
          } else {
            push('/guardian/home')
          }
        } catch (error) {
          console.error('Failed to load user data:', error)
          dispatch(
            setAuthState({
              isAuthenticated: false,
              id: '',
              role: ''
            })
          )
          push('/auth/login?error=profile_load_failed')
        }
      } else if (status === 'unauthenticated') {
        dispatch(
          setAuthState({
            isAuthenticated: false,
            id: '',
            role: ''
          })
        )
        push('/auth/login?error=auth_failed')
      }
    }

    if (status !== 'loading') {
      handlePostAuth()
    }
  }, [session, status, dispatch, push])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-400 to-orange-400">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">
          Rosie Paws
        </h2>
        <p className="text-gray-600">Setting up your account...</p>
        <p className="text-sm text-gray-400 mt-2">Determining your dashboard</p>
      </div>
    </div>
  )
}

export default CustomCallback
