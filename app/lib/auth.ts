import magicLinkTemplate from '@/app/lib/email-templates/magic-link'
import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { Resend } from 'resend'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  pages: {
    error: '/auth/error', // Create this page to see detailed errors
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
      from: process.env.RESEND_FROM_EMAIL!,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        console.log('Sending magic link to:', email)
        console.log('🔗 Magic link URL:', url)

        const resend = new Resend(process.env.RESEND_API_KEY)

        try {
          const { data, error } = await resend.emails.send({
            from: provider.from || '',
            to: email,
            subject: 'Sign in to Your App',
            html: magicLinkTemplate(url)
          })

          if (error) {
            console.error('Resend API error:', error)
            throw new Error(`Failed to send email: ${error.message}`)
          }

          console.log('Magic link sent successfully:', data?.id)

          // Debug: Check if token was created
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
    async signIn({ user, account, email: emailData }) {
      console.log('🔍 SignIn callback - Full details:', {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        account: {
          provider: account?.provider,
          type: account?.type,
          providerAccountId: account?.providerAccountId
        },
        emailData: emailData,
        isVerificationRequest: !!emailData?.verificationRequest
      })

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
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                emailVerified: new Date(),
                name: user.name || null,
                image: user.image || null
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

      // For other providers (Google, etc.)
      return true
    },
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id
        // Add your custom user fields here
        session.user.role = user.role || ''
        session.user.isAdmin = user.isAdmin || false
        session.user.isGuardian = user.isGuardian || false
        session.user.isProUser = user.isProUser || false
        session.user.isPremiumUser = user.isPremiumUser || false
        session.user.isBasicUser = user.isBasicUser || false
        session.user.isFreeUser = user.isFreeUser || false
        session.user.isSuperUser = user.isSuperUser || false
        session.user.firstName = user.firstName || ''
        session.user.lastName = user.lastName || ''
        session.user.tokens = user.tokens || 0
        session.user.tokensUsed = user.tokensUsed || 0
        session.user.stripeCustomerId = user.stripeCustomerId || ''
      }
      return session
    }
  },
  events: {
    async createUser({ user }) {
      console.log('🎉 USER CREATED:', {
        id: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      })
    },
    async linkAccount({ user, account }) {
      console.log('🔗 ACCOUNT LINKED:', {
        userId: user.id,
        email: user.email,
        provider: account.provider,
        type: account.type,
        timestamp: new Date().toISOString()
      })
    },
    async signIn({ user, account, isNewUser }) {
      console.log('✅ SIGN IN EVENT:', {
        email: user.email,
        provider: account?.provider,
        isNewUser: isNewUser,
        timestamp: new Date().toISOString()
      })

      // Check what's actually in the database after sign-in
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true }
        })

        console.log('📊 DATABASE STATE AFTER SIGN-IN:', {
          userExists: !!dbUser,
          accountCount: dbUser?.accounts?.length || 0,
          accounts: dbUser?.accounts?.map((acc) => `${acc.provider}:${acc.type}`) || []
        })
      } catch (error) {
        console.error('❌ Error checking database state:', error)
      }
    }
  }
})
