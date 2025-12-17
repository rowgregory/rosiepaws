
import { NextRequest, NextResponse } from 'next/server'
import { createVet } from './services/createVet'
import { getVet } from './services/getVet'
import { updateVet } from './services/updateVet'
import { deleteVet } from './services/deleteVet'
import { requireAuth } from '@/app/lib/auth/getServerSession'

// GET method - Get user's vet information
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    return await getVet(req, user.id);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

// POST method - Create new vet profile
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    return await createVet(req, user.id);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

// PUT method - Update existing vet profile
export async function PUT(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    return await updateVet(req, user.id);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

// DELETE method - Delete vet profile
export async function DELETE(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    return await deleteVet(req, user.id);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}
