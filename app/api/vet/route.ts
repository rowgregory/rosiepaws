import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { NextRequest, NextResponse } from 'next/server'
import { createVet } from './services/createVet'
import { getVet } from './services/getVet'
import { updateVet } from './services/updateVet'
import { deleteVet } from './services/deleteVet'

// Helper function to handle user authentication
async function handleAuth(req: NextRequest) {
  const userAuth = getUserFromHeader({ req })

  if (!userAuth.success) {
    return { success: false, response: userAuth.response! }
  }

  return { success: true, userId: userAuth.userId }
}

// GET method - Get user's vet information
export async function GET(req: NextRequest) {
  const auth = await handleAuth(req)

  if (!auth.success) {
    return auth.response
  }

  try {
    return await getVet(req, auth.userId)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}

// POST method - Create new vet profile
export async function POST(req: NextRequest) {
  const auth = await handleAuth(req)

  if (!auth.success) {
    return auth.response
  }

  try {
    return await createVet(req, auth.userId)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}

// PUT method - Update existing vet profile
export async function PUT(req: NextRequest) {
  const auth = await handleAuth(req)

  if (!auth.success) {
    return auth.response
  }

  try {
    return await updateVet(req, auth.userId)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}

// DELETE method - Delete vet profile
export async function DELETE(req: NextRequest) {
  const auth = await handleAuth(req)

  if (!auth.success) {
    return auth.response
  }

  try {
    return await deleteVet(req, auth.userId)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
