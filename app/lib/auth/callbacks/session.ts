import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export async function sessionCallback({ session, token }: { session: Session; token: JWT }) {
  if (token.userId) {
    session.user.id = token.userId
    session.user.email = token.email
    session.user.role = token.role
    session.user.isAdmin = token.isAdmin
    session.user.isSuperUser = token.isSuperUser
    session.user.isFreeUser = token.isFreeUser
    session.user.isComfortUser = token.isComfortUser
    session.user.isLegacyUser = token.isLegacyUser
  }

  return session
}
