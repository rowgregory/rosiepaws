import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

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
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account'
        }
      }
    }),
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      maxAge: 15 * 60, // 15 mins
      from: process.env.RESEND_FROM_EMAIL!,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        console.log('Sending magic link to:', email)
        console.log('🔗 Magic link URL:', url)

        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-verification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email,
              url,
              from: provider.from
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Failed to send email: ${errorData.error}`)
          }

          setTimeout(async () => {
            try {
              const tokens = await prisma.verificationToken.findMany({
                where: { identifier: email }
              })
              console.log('🎫 Tokens in DB after email sent:', tokens.length)
            } catch (err) {
              console.error('Error checking tokens:', err)
            }
          }, 1000)
        } catch (error) {
          console.error('Failed to send verification email:', error)
          throw error
        }
      }
    }
  ],
  callbacks: {
    async signIn({ user, account, profile, email: emailData }) {
      // If this is just the initial email sending request, allow it
      if (emailData?.verificationRequest) {
        console.log('📧 This is a verification request (sending email) - allowing')
        return true
      }

      // This is the actual sign-in attempt (user clicked the magic link)
      if (account?.provider === 'email') {
        console.log('🔗 This is a magic link click - token already validated by NextAuth')

        try {
          // Ensure user exists and get/create the account record
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          })

          // If user doesn't exist, create them
          if (!dbUser) {
            console.log('👤 Creating new user for email provider')

            const isAdminEmail = user.email === process.env.JACI_EMAIL || user.email === process.env.SUPER_USER
            const isSuperUser = user.email === process.env.SUPER_USER

            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                emailVerified: new Date(),
                name: user.name || null,
                image: user.image || null,
                isAdmin: isAdminEmail,
                isSuperUser: isSuperUser,
                role: isAdminEmail ? 'ADMIN' : undefined
              },
              include: { accounts: true }
            })
            console.log('✅ User created successfully')
          }

          // Check if email account exists
          const emailAccount = dbUser.accounts.find((acc) => acc.provider === 'email')

          if (!emailAccount) {
            console.log('🔧 NextAuth did not create email account - creating manually')
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: 'email',
                provider: 'email',
                providerAccountId: user.email!
              }
            })
            console.log('✅ Email account created manually')
          } else {
            console.log('✅ Email account already exists')
          }

          return true
        } catch (error) {
          console.error('❌ Error handling email provider sign-in:', error)
          return false
        }
      }

      // Handle Google provider - extract and save firstName/lastName + account linking
      if (account?.provider === 'google') {
        console.log('👤 Google sign-in - checking for existing user')
        try {
          // Check if a user already exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          })

          if (existingUser) {
            console.log('👤 Found existing user - checking account linking')

            // Check if this Google account is already linked
            const existingGoogleAccount = existingUser.accounts.find(
              (acc) => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
            )

            if (!existingGoogleAccount) {
              console.log('🔗 Linking Google account to existing user')

              // Link the Google account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                  scope: account.scope,
                  token_type: account.token_type
                }
              })

              console.log('✅ Linked Google account to existing user')
            }

            // Update user info from Google profile if name fields are missing
            if (profile?.name && (!existingUser.firstName || !existingUser.lastName)) {
              const nameParts = profile.name.split(' ')
              const firstName = nameParts[0] || ''
              const lastName = nameParts.slice(1).join(' ') || ''

              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  firstName,
                  lastName,
                  name: profile.name,
                  image: user.image || profile.picture
                }
              })

              console.log('✅ Updated existing user name from Google profile')
            }

            // Set the user.id so the adapter knows to use the existing user
            user.id = existingUser.id
          } else {
            console.log('👤 New Google user - name will be handled in JWT callback')
          }
        } catch (error) {
          console.error('❌ Error in Google sign-in callback:', error)
          // Don't fail the sign-in if linking fails
        }
      }

      // For other providers or fallback
      return true
    },
    async session({ session, token }) {
      // Pass all the user data from token to session
      if (token.userId) {
        session.user.id = token.userId
        session.user.pets = token.pets

        // Add these missing properties
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.role = token.role
        session.user.isAdmin = token.isAdmin
        session.user.isSuperUser = token.isSuperUser
        session.user.isGuardian = token.isGuardian
        session.user.isFreeUser = token.isFreeUser
        session.user.isComfortUser = token.isComfortUser
        session.user.isCompanionUser = token.isCompanionUser
        session.user.isLegacyUser = token.isLegacyUser
        session.user.stripeSubscription = token.stripeSubscription
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        // First time sign in - user was just created by the adapter
        token.userId = user.id
        token.role = user.role
        token.isAdmin = user.isAdmin

        // If this is a new Google user, update their name fields
        if (account?.provider === 'google' && user.name && !user.firstName) {
          try {
            const nameParts = user.name.split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''

            await prisma.user.update({
              where: { id: user.id },
              data: {
                firstName,
                lastName
              }
            })

            console.log('✅ Updated new Google user name fields')
          } catch (error) {
            console.error('❌ Failed to update new user name:', error)
          }
        }

        // Fetch fresh user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            pets: true,
            stripeSubscription: true
          }
        })

        if (dbUser) {
          token.pets = dbUser.pets || []
          token.firstName = dbUser.firstName || undefined
          token.lastName = dbUser.lastName || undefined
          token.role = dbUser.role || undefined
          token.isAdmin = dbUser.isAdmin ?? false
          token.isSuperUser = dbUser.isSuperUser ?? false
          token.isGuardian = dbUser.isGuardian ?? false
          token.isFreeUser = dbUser.isFreeUser ?? false
          token.isComfortUser = dbUser.isComfortUser ?? false
          token.isCompanionUser = dbUser.isCompanionUser ?? false
          token.isLegacyUser = dbUser.isLegacyUser ?? false
          token.stripeSubscription = dbUser.stripeSubscription || undefined
        }
      }
      return token
    }
  }
})
