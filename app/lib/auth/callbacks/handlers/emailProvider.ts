import prisma from '@/prisma/client'
import type { User } from 'next-auth'

export async function handleEmailProvider(user: User) {
  console.log('🔗 Processing magic link sign-in')

  const dbUser = await findOrCreateUser(user)
  await ensureEmailAccount(dbUser.id, user.email!)

  return true
}

async function findOrCreateUser(user: User) {
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        emailVerified: new Date(),
        name: user.name || null,
        image: user.image || null,
        role: 'Free'
      },
      include: { accounts: true }
    })
  }

  return dbUser
}

async function ensureEmailAccount(userId: string, email: string) {
  const existing = await prisma.account.findFirst({
    where: { userId, provider: 'email' }
  })

  if (!existing) {
    await prisma.account.create({
      data: {
        userId,
        type: 'email',
        provider: 'email',
        providerAccountId: email
      }
    })
  }
}
