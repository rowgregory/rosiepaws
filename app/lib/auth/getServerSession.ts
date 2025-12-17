import { auth } from '../auth'

export async function requireAuth() {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error('Unauthorized')
  }

  return session
}

export async function requireAdmin() {
  const session = await requireAuth()

  if (!session.user.isAdmin && !session.user.isSuperUser) {
    throw new Error('Forbidden: Admin access required')
  }

  return session
}

export async function requireSuperUser() {
  const session = await requireAuth()

  if (!session.user.isSuperUser) {
    throw new Error('Forbidden: Super user access required')
  }

  return session
}
