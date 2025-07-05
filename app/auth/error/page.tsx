'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages = {
    auth_failed: 'Authentication failed. This could be due to an expired token or database issue.',
    invalid_token: 'The verification token is invalid or has expired.',
    database_error: 'There was a database connection issue.',
    default: 'An unknown authentication error occurred.'
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="text-gray-700 mb-4">
        {errorMessages[error as keyof typeof errorMessages] || errorMessages.default}
      </p>
      <p className="text-sm text-gray-500 mb-4">Error code: {error || 'unknown'}</p>
      <a href="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Try Again
      </a>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
