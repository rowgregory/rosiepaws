import { createLog } from '@/app/lib/api/createLog'
import prisma from '@/prisma/client'
import type { Account, Profile, User } from 'next-auth'

export async function handleGoogleProvider(user: User, account: Account, profile?: Profile) {
  console.log('👤 Processing Google sign-in')

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (existingUser) {
    await linkGoogleAccount(existingUser, account)
    await updateUserFromProfile(existingUser, profile)
    user.id = existingUser.id // Use existing user
  } else {
    await logNewGoogleUser(user, account)
  }

  return true
}

async function linkGoogleAccount(existingUser: any, account: Account) {
  const hasGoogleAccount = existingUser.accounts.some(
    (acc: any) => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
  )

  if (!hasGoogleAccount) {
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
  }
}

async function updateUserFromProfile(user: any, profile?: Profile) {
  if (profile?.name && (!user.firstName || !user.lastName)) {
    const [firstName, ...lastNameParts] = profile.name.split(' ')

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName: lastNameParts.join(' ') || '',
        name: profile.name,
        image: profile.picture || user.image
      }
    })
  }
}

async function logNewGoogleUser(user: User, account: Account) {
  await createLog('info', 'New Google user - will be handled in JWT callback', {
    location: ['googleProvider.ts'],
    provider: 'google',
    userEmail: user.email,
    accountId: account.providerAccountId
  })
}
