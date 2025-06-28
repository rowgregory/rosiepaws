// types/next-auth.d.ts
import { DefaultSession } from 'next-auth'
import { StripeSubscription } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      name: string
      role: string
      stripeSubscription?: StripeSubscription | null
      isSuperUser: boolean
      isAdmin: boolean
      isGuardian: boolean
      isFreeUser: boolean
      isBasicUser: boolean
      isProUser: boolean
      isPremiumUser: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: string
    isProUser: boolean
    isBasicUser: boolean
    isPremiumUser: boolean
    stripeSubscription: any
  }
}
