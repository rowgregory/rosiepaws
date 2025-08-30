import type { Account, Profile, User } from 'next-auth'
import { handleEmailProvider } from './handlers/emailProvider'
import { handleGoogleProvider } from './handlers/googleProvider'

export async function signInCallback({
  user,
  account,
  profile,
  email
}: {
  user: User
  account?: Account | null
  profile?: Profile
  email?: { verificationRequest?: boolean }
}) {
  // Email verification request - always allow
  if (email?.verificationRequest) {
    console.log('📧 This is a verification request (sending email) - allowing')
    return true
  }

  // Route to appropriate provider handler
  try {
    switch (account?.provider) {
      case 'email':
        return await handleEmailProvider(user)

      case 'google':
        return await handleGoogleProvider(user, account, profile)

      default:
        return true
    }
  } catch (error) {
    console.error(`❌ Sign-in error for ${account?.provider}:`, error)
    return false
  }
}
