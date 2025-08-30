import { User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export async function jwtCallback({ token, user }: { token: JWT; user: User }) {
  if (user) {
    token.userId = user.id
    token.role = user.role
    token.isAdmin = user.isAdmin
    token.isSuperUser = user.isSuperUser
    token.isFreeUser = user.isFreeUser
    token.isComfortUser = user.isComfortUser
    token.isLegacyUser = user.isLegacyUser
    token.email = user.email as string
  }
  return token
}
