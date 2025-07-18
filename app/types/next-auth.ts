// types/next-auth.d.ts
import { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: string
      firstName?: string
      lastName?: string
      isAdmin?: boolean
      isGuardian?: boolean
      isSuperUser?: boolean
      isFreeUser?: boolean
      isComfortUser?: boolean
      isCompanionUser?: boolean
      isLegacyUser?: boolean
      tokens?: number
      tokensUsed?: number
      pets?: any[]
      stripeSubscription?: any
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    role?: string
    firstName?: string
    lastName?: string
    isAdmin?: boolean
    isGuardian?: boolean
    isSuperUser?: boolean
    isFreeUser?: boolean
    isComfortUser?: boolean
    isCompanionUser?: boolean
    isLegacyUser?: boolean
    tokens?: number
    tokensUsed?: number
    pets?: any[]
    stripeSubscription?: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId?: string
    role?: string
    firstName?: string
    lastName?: string
    isAdmin?: boolean
    isGuardian?: boolean
    isSuperUser?: boolean
    isFreeUser?: boolean
    isComfortUser?: boolean
    isCompanionUser?: boolean
    isLegacyUser?: boolean
    tokens?: number
    tokensUsed?: number
    pets?: any[]
    stripeSubscription?: any
  }
}
