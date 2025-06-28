'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { RootState, useAppSelector } from '@/app/redux/store'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const user = useAppSelector((state: RootState) => state.user)
  console.log('USER: ', user)

  const handleGoogleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const result = await signIn('google', {
        callbackUrl: '/auth/callback', // Go to callback page after OAuth
        redirect: false
      })
      console.log('result: ', result)
      if (result?.ok && result?.url) {
        window.location.href = result.url
      } else {
        setError('Sign-in failed. Please try again.')
      }
    } catch {
      setError('Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) return
    setIsLoading(true)
    setError('')
    try {
      const result = await signIn('nodemailer', {
        email,
        redirect: false
      })

      if (result?.ok) {
        setError('')
        // Show success message
        alert('Magic link sent! Check your email.')
      } else {
        setError('Failed to send magic link')
      }
    } catch (error) {
      console.error('Magic link error:', error)
      setError('Failed to send magic link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCredentialsSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    setError('')
    try {
      const result = await signIn('email', {
        email,
        redirect: false
      })

      if (result?.ok) {
        window.location.href = '/dashboard'
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      console.error('Credentials sign in error:', error)
      setError('Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100dvh-148px)] bg-gradient-to-br from-pink-400 via-red-400 to-orange-400 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10"
      >
        {/* Logo Area */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11S11 10.1 11 9V7.5L5 7V9C5 10.1 4.1 11 3 11S1 10.1 1 9V7.5C1 6.1 2.1 5 3.5 5L20.5 5C21.9 5 23 6.1 23 7.5V9C23 10.1 22.1 11 21 11S19 10.1 19 9M7.5 12C8.3 12 9 12.7 9 13.5V16.5C9 17.3 8.3 18 7.5 18S6 17.3 6 16.5V13.5C6 12.7 6.7 12 7.5 12ZM16.5 12C17.3 12 18 12.7 18 13.5V16.5C18 17.3 17.3 18 16.5 18S15 17.3 15 16.5V13.5C15 12.7 15.7 12 16.5 12Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Rosie Paws
          </h1>
          <p className="text-gray-600 mt-2">Welcome back to compassionate care</p>
        </motion.div>

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

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

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

        {/* Email/Password Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mb-6"
        >
          <button
            onClick={() => setShowEmailLogin(!showEmailLogin)}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
          >
            {showEmailLogin ? 'Hide' : 'Use'} email and password
          </button>
        </motion.div>

        {/* Email/Password Form */}
        {showEmailLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCredentialsSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center mt-8 pt-6 border-t border-gray-100"
        >
          <p className="text-xs text-gray-500">By signing in, you agree to our compassionate care principles</p>
          <p className="text-xs text-gray-400 mt-2">Every moment deserves to be remembered 🐾</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
export default Login
