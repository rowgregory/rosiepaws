import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { requireAdmin } from '@/app/lib/auth/getServerSession'

// Validation function for ticket status
const validateTicketStatus = ({ status }: { status: string }) => {
  const validStatuses = ['open', 'in_progress', 'resolved', 'closed']
  const errors: string[] = []

  if (!status?.trim()) {
    errors.push('Status is required')
  }

  if (status && !validStatuses.includes(status.toLowerCase())) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`)
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

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  try {
     const {user: userInfo} = await requireAdmin();

    const { ticketId } = await params
    const { status, notes } = await req.json()

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

    // Validate status
    const validatedStatus = validateTicketStatus({ status })
    if (!validatedStatus.success) {
      return validatedStatus.response!
    }

    // Get user details to check if they are staff (super user)
    const user = await prisma.user.findUnique({
      where: { id: userInfo.id },
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

    // Check if user is staff (only staff can update ticket status)
    const isStaff = user.email === process.env.SUPER_USER

    if (!isStaff) {
      await createLog('warn', 'Unauthorized ticket status update attempt', {
        location: ['api route - PATCH /api/tickets/[ticketId]/status'],
        name: 'UnauthorizedTicketStatusUpdate',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ticketId,
        userId: userInfo.id,
        userEmail: user.email,
        attemptedStatus: status
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Access denied',
          message: 'Only support staff can update ticket status'
        },
        { status: 403 }
      )
    }

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      },
      select: {
        id: true,
        status: true,
        subject: true,
        userId: true,
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
          message: 'The ticket you are trying to update does not exist'
        },
        { status: 404 }
      )
    }

    const normalizedStatus = status.toLowerCase()
    const previousStatus = existingTicket.status

    // Check if status is actually changing
    if (previousStatus === normalizedStatus) {
      return NextResponse.json(
        {
          success: false,
          error: 'No change required',
          message: `Ticket is already ${normalizedStatus}`
        },
        { status: 400 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update ticket status
      const updatedTicket = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: normalizedStatus,
          updatedAt: new Date()
        },
        select: {
          id: true,
          status: true,
          subject: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          messages: true
        }
      })

      let newTicketMessage

      // Optionally add a system message about the status change
      if (notes || normalizedStatus === 'closed' || normalizedStatus === 'resolved' || normalizedStatus === 'open') {
        const systemMessage = notes || `Ticket status changed from ${previousStatus} to ${normalizedStatus}`

        newTicketMessage = await tx.ticketMessage.create({
          data: {
            ticketId,
            content: systemMessage,
            isStaff: true,
            authorEmail: user.email,
            authorName: user.name || 'Support Team'
          }
        })
      }

      return { updatedTicket, newTicketMessage }
    })

    await createLog('info', 'Ticket status updated successfully', {
      location: ['api route - PATCH /api/tickets/[ticketId]/status'],
      name: 'TicketStatusUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      ticketId,
      userId: userInfo.id,
      userEmail: user.email,
      previousStatus,
      newStatus: normalizedStatus,
      customerEmail: existingTicket.user.email,
      hasNotes: !!notes,
      notesLength: notes?.length || 0
    })

    return NextResponse.json(
      {
        ticket: result.updatedTicket,
        message: `Ticket status updated from ${previousStatus} to ${normalizedStatus}`,
        previousStatus,
        newStatus: normalizedStatus,
        ticketMessage: result.newTicketMessage
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Update ticket status',
      sliceName: 'support'
    })
  }
}
