// lib/auth.ts
import { JWTPayload, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { User } from '../types/common.types'

function mapJwtPayloadToUser(payload: JWTPayload | null): User | null {
  if (!payload) return null

  return {
    isAuthenticated: true,
    role: payload.role as string, // cast or validate these exist
    isAdmin: !!payload.isAdmin, // or Boolean(payload.isAdmin)
    id: payload.sub as string,
    exp: payload.exp as number
  }
}

export async function getUserFromServerCookie() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('authToken')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))

    const user = mapJwtPayloadToUser(payload)
    return user
  } catch {
    return null
  }
}
