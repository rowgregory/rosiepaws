import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      isAdmin: boolean
      isGuardian: boolean
      isProUser: boolean
      isPremiumUser: boolean
      isBasicUser: boolean
      isFreeUser: boolean
      isSuperUser: boolean
      firstName?: string
      lastName?: string
      tokens: number
      tokensUsed: number
      stripeCustomerId?: string
      stripeSubscription?: any
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role: string
    isAdmin: boolean
    isGuardian: boolean
    isProUser: boolean
    isPremiumUser: boolean
    isBasicUser: boolean
    isFreeUser: boolean
    isSuperUser: boolean
    firstName?: string
    lastName?: string
    tokens: number
    tokensUsed: number
    stripeCustomerId?: string
  }
}
