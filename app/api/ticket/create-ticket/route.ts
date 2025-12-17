import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import sendTicketConfirmation from '@/app/lib/resend/sendTicketConfirmation'
import { requireAuth } from '@/app/lib/auth/getServerSession'

// Validation function for required ticket fields
const validateTicketRequiredFields = ({
  category,
  priority,
  subject,
  description,
  email
}: {
  category: string
  priority: string
  subject: string
  description: string
  email: string
}) => {
  const errors: string[] = []

  if (!category?.trim()) {
    errors.push('Category is required')
  }

  if (!priority?.trim()) {
    errors.push('Priority is required')
  }

  if (!subject?.trim()) {
    errors.push('Subject is required')
  }

  if (!description?.trim()) {
    errors.push('Description is required')
  }

  if (!email?.trim()) {
    errors.push('Email is required')
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address')
    }
  }

  // Validate priority values
  const validPriorities = ['low', 'medium', 'high', 'urgent']
  if (!validPriorities.includes(priority?.toLowerCase())) {
    errors.push('Priority must be one of: low, medium, high, urgent')
  }

  // Validate category (adjust based on your categories)
  const validCategories = ['technical', 'account', 'feature', 'general']
  if (!validCategories.includes(category?.toLowerCase())) {
    errors.push('Category must be one of: technical, account, feature, general')
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

export async function POST(req: NextRequest) {
  try {
    const {user} = await requireAuth();

    const { category, priority, subject, description, email, deviceInfo, attachments } = await req.json()

    // Validate required fields
    const validatedFields = validateTicketRequiredFields({
      category,
      priority,
      subject,
      description,
      email
    })

    if (!validatedFields.success) {
      return validatedFields.response!
    }

    // Create ticket
    const newTicket = await prisma.ticket.create({
      data: {
        category: category.toLowerCase(),
        priority: priority.toLowerCase(),
        subject: subject.trim(),
        description: description.trim(),
        email: email.toLowerCase().trim(),
        deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : '',
        attachments: attachments || [],
        userId: user.id!
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    await sendTicketConfirmation(newTicket, req, user.id!)

    await createLog('info', 'Ticket created successfully', {
      location: ['api route - POST /api/support/create-ticket'],
      name: 'TicketCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      ticketId: newTicket.id,
      userId: user.id,
      category: newTicket.category,
      priority: newTicket.priority
    })

    return NextResponse.json(
      {
        ticket: newTicket
      },
      { status: 201 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Ticket creation',
      sliceName: 'ticketSlice'
    })
  }
}
