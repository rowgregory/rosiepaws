import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { requireAuth } from '@/app/lib/auth/getServerSession'

// Validation function for required message fields
const validateMessageRequiredFields = ({ content }: { content: string }) => {
  const errors: string[] = []

  if (!content?.trim()) {
    errors.push('Message content is required')
  }

  if (content && content.trim().length < 1) {
    errors.push('Message content cannot be empty')
  }

  if (content && content.trim().length > 5000) {
    errors.push('Message content cannot exceed 5000 characters')
  }

  if (errors.length > 0) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      )
    }
  }

  return { success: true }
}

export async function POST(req: NextRequest, { params }: { params: any }) {
  try {
    const {user: { id }} = await requireAuth();

    const { ticketId } = await params
    const { content, attachments = [], authorEmail, authorName } = await req.json()

    // Validate ticketId
    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket ID is required'
        },
        { status: 400 }
      )
    }

    // Validate required fields
    const validatedFields = validateMessageRequiredFields({
      content
    })

    if (!validatedFields.success) {
      return validatedFields.response!
    }

    // Get user details to determine if they are staff
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      )
    }

    // Check if user is staff (super user)
    const isSuperUser = user.email === process.env.SUPER_USER

    // Check if ticket exists and user has permission
    const existingTicket = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      },
      select: {
        id: true,
        userId: true,
        status: true,
        subject: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    if (!existingTicket) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket not found',
          message: 'The ticket you are trying to reply to does not exist'
        },
        { status: 404 }
      )
    }

    // Check if user owns the ticket (or is staff - add staff check if needed)
    if (existingTicket.userId !== id && !isSuperUser) {
      await createLog('warn', 'Unauthorized ticket message creation attempt', {
        location: ['api route - POST /api/support/tickets/[ticketId]/messages'],
        name: 'UnauthorizedMessageCreation',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ticketId,
        userId: id,
        ticketOwnerId: existingTicket.userId
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Access denied',
          message: 'You do not have permission to add messages to this ticket'
        },
        { status: 403 }
      )
    }

    // Check if ticket is closed
    if (existingTicket.status === 'closed') {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket is closed',
          message: 'Cannot add messages to a closed ticket'
        },
        { status: 400 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create the message
      const newMessage = await tx.ticketMessage.create({
        data: {
          ticketId,
          content: content.trim(),
          isStaff: isSuperUser,
          attachments: attachments || [],
          authorEmail: authorEmail || existingTicket.user.email,
          authorName: authorName || existingTicket.user.name
        },
        select: {
          id: true,
          content: true,
          isStaff: true,
          attachments: true,
          authorEmail: true,
          authorName: true,
          createdAt: true
        }
      })

      // Update ticket's updatedAt timestamp
      const updatedTicket = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          updatedAt: new Date()
        },
        select: {
          id: true,
          updatedAt: true
        }
      })

      return { newMessage, updatedTicket }
    })

    await createLog('info', 'Ticket message created successfully', {
      location: ['api route - POST /api/support/tickets/[ticketId]/messages'],
      name: 'TicketMessageCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      ticketId,
      messageId: result.newMessage.id,
      userId: id,
      isStaff: isSuperUser,
      contentLength: content.trim().length
    })

    return NextResponse.json(
      {
        message: result.newMessage
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Create ticket message',
      sliceName: 'support'
    })
  }
}
