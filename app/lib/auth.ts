import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Resend from 'next-auth/providers/resend'
import { enhanceNewUser } from '../actions/enhanceNewUser'

export async function signInCallback({ user, account }: any) {
  try {
    console.log('SignIn attempt:', {
      email: user.email,
      provider: account?.provider,
      accountType: account?.type
    })

    if (account?.provider === 'google' || account?.provider === 'github') {
      // Check if user exists with this email
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          accounts: true
        }
      })

      if (existingUser) {
        console.log('Found existing user:', existingUser.id)

        // Check if this OAuth account is already linked
        const existingAccount = existingUser.accounts.find((acc) => acc.provider === account.provider)

        if (!existingAccount) {
          console.log('Manually linking OAuth account to existing user')

          // MANUALLY CREATE THE ACCOUNT LINK
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state
            }
          })

          console.log('Successfully linked account')
        } else {
          console.log('OAuth account already linked')
        }

        // Enhance user data if needed
        await enhanceNewUser(user.email!, user.name || '')
        return true
      } else {
        console.log('New user - will be created automatically')
        return true
      }
    }

    // For other auth methods
    if (user.email) {
      await enhanceNewUser(user.email, user.name || '')
    }

    return true
  } catch (error) {
    console.error('SignIn callback error:', error)
    return true // Still allow sign in
  }
}

const config = {
  session: {
    strategy: 'jwt' as const, // This will create JWT tokens instead
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: [
    process.env.NEXTAUTH_SECRET!, // Current secret
    process.env.NEXTAUTH_SECRET_FALLBACK! // Previous secret (if you changed it)
  ],
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.RESEND_FROM_EMAIL!
    })
  ],
  allowDangerousEmailAccountLinking: true,
  callbacks: {
    async signIn({ user, account }: any) {
      return await signInCallback({ user, account })
    },
    async jwt({ token, user, trigger, session }: any) {
      // On sign in, add user data to token

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            stripeSubscription: true
          }
        })

        if (!dbUser) return

        token.userId = dbUser.id
        token.role = dbUser.role
        token.isAdmin = dbUser.isAdmin
        token.isGuardian = dbUser.isGuardian
        token.isProUser = dbUser.isProUser
        token.isPremiumUser = dbUser.isPremiumUser
        token.isFreeUser = dbUser.isFreeUser
        token.firstName = dbUser.firstName
        token.lastName = dbUser.lastName
        token.stripeSubscription = dbUser.stripeSubscription
      }

      // On session update, refresh token with latest user data
      if (trigger === 'update' && session) {
        // You could fetch fresh user data here if needed
        // But avoid database calls in middleware
      }

      return token
    },

    async session({ session, token }: any) {
      // Pass token data to session

      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.isGuardian = token.isGuardian as boolean
        session.user.isProUser = token.isProUser as boolean
        session.user.isPremiumUser = token.isPremiumUser as boolean
        session.user.isFreeUser = token.isFreeUser as boolean
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.stripeSubscription = token.stripeSubscription as any
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login'
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
