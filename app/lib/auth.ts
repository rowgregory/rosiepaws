import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { signInCallback } from './auth/callbacks/signIn'
import { sessionCallback } from './auth/callbacks/session'
import { jwtCallback } from './auth/callbacks/jwt'
import googleProvider from './auth/providers/googleProvider'
import magicLinkProvider from './auth/providers/magicLinkProvider'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: false,
  session: {
    strategy: 'jwt', // More efficient than database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours - how often to update
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    error: '/auth/error',
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-request'
  },
  providers: [googleProvider, magicLinkProvider],
  callbacks: {
    signIn: signInCallback,
    session: sessionCallback,
    jwt: jwtCallback
  }
})
