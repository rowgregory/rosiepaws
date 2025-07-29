'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import AuthErrorDrawer from '@/app/drawers/general/AuthErrorDrawer'
import { useRouter, useSearchParams } from 'next/navigation'
import { setOpenAuthErrorDrawer, setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { useAppDispatch } from '@/app/redux/store'
import SlideMessage from '@/app/components/auth/SlideMessage'

const Login = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleGoogleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('google', {
        callbackUrl: '/auth/custom-callback',
        redirect: false
      })

      if (result?.ok && result?.url) {
        window.location.href = result.url
      } else {
        // setError('Sign-in failed. Please try again.')
      }
    } catch {
      // setError('Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/auth/custom-callback'
      })

      if (result?.ok) {
        dispatch(setOpenSlideMessage())
      } else {
      }
    } catch (error) {
      console.error('Magic link error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if there's an auth error in the URL
  useEffect(() => {
    const error = searchParams.get('error')

    if (error === 'Verification') {
      dispatch(setOpenAuthErrorDrawer())
    }
  }, [dispatch, router, searchParams])

  return (
    <>
      <SlideMessage message="Your magic link has been sent successfully." type="Success!" />
      <AuthErrorDrawer />
      <div className="min-h-dvh p-10 flex bg-gradient-to-tr from-red-100 via-pink-100 to-orange-100">
        {/* Left Side - Login Form */}
        <div className="w-80 bg-white p-8 flex flex-col justify-between">
          {/* Logo and Header */}
          <div>
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="flex items-center space-x-2 mb-2"
              >
                <div className="w-20 h-20 bg-contain bg-logo bg-no-repeat bg-center" />
              </motion.div>
            </Link>

            {/* Login Options */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Sign up or Login with</h2>

              {/* Google Sign In */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-4 mb-6"
              >
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-50 group"
                >
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </motion.div>

              <div className="text-center text-gray-500 text-sm my-4">OR</div>

              {/* Magic Link Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-4 mb-6"
              >
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 pl-12"
                    required
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMagicLink}
                  disabled={isLoading || !email}
                  className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Magic Link'
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-4">
            <div className="flex gap-4 text-xs text-gray-500">
              <Link href="/privacy-policy" className="hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-gray-700">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-center p-12">
            <motion.div
              className="text-center max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold text-gray-900 mb-6">
                Comprehensive Pet
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Health
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Track your pet&apos;s wellbeing with advanced monitoring tools for pain scoring, water intake, feeding
                records, and vital signs.
              </p>
            </motion.div>

            {/* Bottom Attribution */}
            <div className="absolute bottom-6 right-6 text-sm text-gray-400">
              Pet Care by <span className="text-purple-600">@RosiePaws</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login
