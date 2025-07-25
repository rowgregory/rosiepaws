import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const { ticketId } = params

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

    // Fetch ticket with all related data
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'asc'
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
        }
      }
    })

    // Check if ticket exists
    if (!ticket) {
      await createLog('warn', 'Ticket not found', {
        location: ['api route - GET /api/support/ticket/[ticketId]'],
        name: 'TicketNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ticketId,
        userId: userAuth.userId
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Ticket not found',
          message: 'The ticket you are looking for does not exist'
        },
        { status: 404 }
      )
    }

    // Check if user owns the ticket or is admin (add admin check if needed)
    if (ticket.userId !== userAuth.userId) {
      await createLog('warn', 'Unauthorized ticket access attempt', {
        location: ['api route - GET /api/support/ticket/[ticketId]'],
        name: 'UnauthorizedTicketAccess',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ticketId,
        userId: userAuth.userId,
        ticketOwnerId: ticket.userId
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Access denied',
          message: 'You do not have permission to view this ticket'
        },
        { status: 403 }
      )
    }

    // Parse JSON fields safely
    const processedTicket = {
      ...ticket,
      deviceInfo: ticket.deviceInfo ? JSON.parse(ticket.deviceInfo) : null,
      attachments: ticket.attachments || [],
      messages: ticket.messages.map((message) => ({
        ...message,
        attachments: message.attachments || []
      }))
    }

    return NextResponse.json(
      {
        ticket: processedTicket
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Fetch ticket by ID',
      sliceName: 'support'
    })
  }
}
