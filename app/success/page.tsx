'use client'

import React from 'react'
import { motion } from 'framer-motion'

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-600 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-emerald-600 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-500 rounded-full"></div>
        <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-emerald-500 rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center relative z-10"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>

        {/* Main Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Payment Successful! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-lg text-gray-700 mb-8"
        >
          Thank you for subscribing to Rosie Paws!
          <br />
          Your account is being set up.
        </motion.p>

        {/* What's Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6 mb-8 border border-pink-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <span className="mr-2">📋</span>
            What&apos;s Next?
          </h2>

          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Your 7-day free trial has started</p>
                <p className="text-gray-600 text-sm">Full access to all Comfort plan features</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Sign in to access your dashboard</p>
                <p className="text-gray-600 text-sm">Use the same Google account you just used to pay</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Start tracking your pet&apos;s care</p>
                <p className="text-gray-600 text-sm">Add your pet and begin their health journey</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trial Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-200"
        >
          <div className="flex items-center justify-center mb-2">
            <span className="text-blue-600 mr-2">🆓</span>
            <span className="font-semibold text-blue-900">7-Day Free Trial</span>
          </div>
          <p className="text-blue-800 text-sm">No charges for 7 days. Cancel anytime during your trial with no fees.</p>
        </motion.div>

        {/* Sign In Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4"
        >
          <button
            onClick={() => (window.location.href = '/auth/login')}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Sign In to Your Account
          </button>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@rosiepaws.com" className="text-pink-600 hover:text-pink-700 font-medium">
              support@rosiepawsapp.com
            </a>
          </p>
          <p className="text-gray-400 text-xs mt-2">Every moment with your pet deserves to be remembered 🐾</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SuccessPage
