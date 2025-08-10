'use client'

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import AuthErrorDrawer from '@/app/drawers/general/AuthErrorDrawer'
import { useRouter, useSearchParams } from 'next/navigation'
import { setOpenAuthErrorDrawer, setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { useAppDispatch } from '@/app/redux/store'
import SlideMessage from '@/app/components/auth/SlideMessage'
import { CheckCircle } from 'lucide-react'

const STANDARD_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const Login = () => {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [showError, setShowError] = useState(false)
  const [hasBlurred, setHasBlurred] = useState(false)
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
        setShowMagicLink(false)
        setEmail('')
        setShowError(false)
        setHasBlurred(false)
        setIsValidEmail(false)
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

  useEffect(() => {
    const isValid = STANDARD_EMAIL_REGEX.test(email)
    setIsValidEmail(isValid)

    // Only show error if user has blurred or email looks like they're trying to type an email
    const shouldShowError =
      email.length > 0 && !isValid && (hasBlurred || email.length > 5 || (email.includes('@') && email.includes('.')))

    setShowError(shouldShowError)

    // Show magic link with slight delay for better UX
    if (isValid && !showMagicLink) {
      const timer = setTimeout(() => {
        setShowMagicLink(true)
      }, 300)
      return () => clearTimeout(timer)
    } else if (!isValid && showMagicLink) {
      setShowMagicLink(false)
    }
  }, [email, showMagicLink, hasBlurred])

  const handleBlur = () => {
    setHasBlurred(true)
  }

  const handleFocus = () => {
    if (email.length <= 3) {
      setShowError(false)
    }
  }

  return (
    <>
      <SlideMessage message="Your magic link has been sent successfully." type="Success!" />
      <AuthErrorDrawer />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Side - Login Form */}
        <div className="w-full flex-1 mx-auto bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:w-96 lg:mx-0">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-8">
              🎉
              <span className="mx-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                Sign up now and get 750 tokens daily
              </span>
              🎉
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your free account <br /> or login below
              </h2>
            </div>
            <Link href="/" className="fixed top-3 left-3">
              <div className="bg-logo bg-center bg-no-repeat bg-contain w-20 h-20" />
            </Link>

            {/* Sign-in Options */}
            <div className="space-y-4 mb-6">
              {/* Google Sign In */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center p-0.5 border border-gray-300 rounded-lg shadow-sm bg-[#4285F4] text-sm font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 group relative"
              >
                <div className="flex items-center justify-center bg-white w-12 h-12 rounded-[5px]">
                  <svg className="w-6 h-6 transition-transform" viewBox="0 0 24 24">
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
                </div>
                <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white font-semibold">
                  Continue with Google
                </p>
              </motion.button>

              {/* Magic Link Section */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div
                    className={`w-full flex items-center p-0.5 border rounded-lg shadow-sm bg-gray-200 text-sm font-medium hover:shadow-md transition-all duration-200 group relative ${
                      showError
                        ? 'border-red-300 shadow-red-100'
                        : isValidEmail
                          ? 'border-green-300 shadow-green-100'
                          : 'border-gray-300'
                    }`}
                  >
                    {/* Icon Container */}
                    <div
                      className={`flex flex-1 items-center justify-center w-12 h-12 max-w-12 rounded-[5px] relative z-10 transition-all duration-300 ${
                        isValidEmail ? 'bg-green-100' : showError ? 'bg-red-100' : 'bg-white'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isValidEmail ? (
                          <motion.div
                            key="valid"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </motion.div>
                        ) : (
                          <motion.svg
                            key="default"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className={`w-6 h-6 transition-colors duration-300 ${
                              showError ? 'text-red-400' : 'text-gray-400'
                            }`}
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
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email Input */}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      placeholder="Enter your email"
                      className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex-1 w-full focus:outline-none text-center transition-all duration-300 bg-gray-200`}
                      required
                    />
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {showError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-500 text-center"
                      >
                        Please enter a valid email address
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Magic Link Section */}
                <AnimatePresence>
                  {showMagicLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="space-y-4"
                    >
                      {/* Magic Link Button */}
                      <motion.button
                        onClick={handleMagicLink}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white p-0.5 border rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="h-12 flex items-center justify-center">
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Sending...
                            </div>
                          ) : (
                            'Send Magic Link'
                          )}
                        </div>
                      </motion.button>

                      {/* Description Card */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg
                              className="w-4 h-4 text-blue-600"
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
                          <div>
                            <h3 className="font-semibold text-blue-900 text-sm">Magic Link</h3>
                            <p className="text-blue-700 text-sm mt-1">
                              We&apos;ll send a secure login link to <strong>{email}</strong>. Click the link in your
                              email to sign in instantly!
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Security Note */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-gray-500 text-center"
                      >
                        🔒 Magic links expire in 15 minutes for your security
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
          <div className="flex flex-col justify-center items-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Track Care.
                <span className="block bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Treasure Time.
                </span>
              </h1>

              <div className="text-xl text-gray-600 mb-12">
                Track your pet&apos;s wellbeing with advanced monitoring tools for pain scoring, water intake, feeding
                records, movements and more!.
              </div>

              <div className="space-y-4 text-left max-w-md mx-auto mb-12">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Pain Level Assessment:</div>
                    <div className="text-gray-600 text-sm">
                      Rate your pet&apos;s pain from 0-4 to monitor comfort and identify when care is needed
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Vital Signs Tracking:</div>
                    <div className="text-gray-600 text-sm">Monitor heart rate, temperature, and breathing patterns</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Medication Reminders:</div>
                    <div className="text-gray-600 text-sm">
                      Never miss a dose with smart scheduling and notifications
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Blood Sugar Monitoring:</div>
                    <div className="text-gray-600 text-sm">
                      Track glucose levels and trends to manage diabetes and maintain stable blood sugar
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Vet Report Sharing:</div>
                    <div className="text-gray-600 text-sm">
                      Generate detailed reports to share with your veterinarian
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg text-gray-700 mb-2">
                  Join thousands of <strong>caring pet parents</strong> who trust
                </div>
                <div className="text-gray-600">Rosie Paws to monitor their beloved companions.</div>
              </div>

              {/* Bottom Attribution */}
              <div className="absolute bottom-6 right-6 text-sm text-gray-400">
                Pet Care by <span className="text-pink-600 font-semibold">@RosiePaws</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-500">
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-gray-700">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-gray-700">
            Terms of Service
          </Link>
        </div>
      </div>
    </>
  )
}
export default Login
