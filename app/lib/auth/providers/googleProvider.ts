import Google from 'next-auth/providers/google'

const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      prompt: 'select_account'
    }
  }
})

export default googleProvider
