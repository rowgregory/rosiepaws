import prisma from '@/prisma/client'
import type { EmailConfig } from 'next-auth/providers/email'

const magicLinkProvider: EmailConfig = {
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

export default magicLinkProvider
