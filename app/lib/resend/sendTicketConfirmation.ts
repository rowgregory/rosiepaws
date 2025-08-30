import { Resend } from 'resend'
import { NextRequest } from 'next/server'
import { parseStack } from 'error-stack-parser-es/lite'
import { createLog } from '../api/createLog'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendTicketConfirmation = async (ticket: any, req: NextRequest, userId: string) => {
  const { data, error } = await resend.emails.send({
    from: `${process.env.RESEND_FROM_EMAIL}`,
    to: [ticket.email],
    subject: `🎫 Support Ticket Created: ${ticket.subject} (#${ticket.id.slice(-8)})`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🎫 Support Ticket Created</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We've received your support request!</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #495057; margin-top: 0; font-size: 20px;">Ticket Details</h2>
          
          <div style="margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Ticket ID:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-family: monospace;">#${ticket.id.slice(-8)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Subject:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${ticket.subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Category:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Priority:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">
                  <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; background-color: ${getPriorityColor(ticket.priority)};">
                    ${ticket.priority.toUpperCase()}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Status:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">
                  <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; background-color: #3b82f6;">
                    OPEN
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Created:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${new Date(ticket.createdAt).toLocaleDateString()} at ${new Date(ticket.createdAt).toLocaleTimeString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #495057; vertical-align: top;">Description:</td>
                <td style="padding: 10px 0; color: #6c757d; line-height: 1.5;">${ticket.description}</td>
              </tr>
            </table>
          </div>
          
          ${
            ticket.attachments && ticket.attachments.length > 0
              ? `
          <div style="margin-top: 20px;">
            <h3 style="color: #495057; font-size: 16px; margin-bottom: 10px;">📎 Attachments</h3>
            <ul style="margin: 0; padding-left: 20px; color: #6c757d;">
              ${ticket.attachments
                .map(
                  (attachment: { filename: any }) => `
                <li style="margin-bottom: 5px;">${attachment.filename || 'Attachment'}</li>
              `
                )
                .join('')}
            </ul>
          </div>
          `
              : ''
          }
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-top: 20px;">
            <p style="margin: 0; color: #1d4ed8; font-size: 14px;">
              <strong>💡 What's Next:</strong> Our support team will review your ticket and respond within 24-48 hours. You'll receive email updates when there are new developments.
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin-top: 15px;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>📧 Keep This Email:</strong> Save this confirmation for your records. Reference ticket #${ticket.id.slice(-8)} in any future communications.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>This is an automated confirmation from your Support System</p>
          <p>Sent on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p style="margin-top: 15px;">
            <a href="${process.env.NEXTAUTH_URL}/support/tickets/${ticket.id}" style="color: #3b82f6; text-decoration: none;">
              View Ticket Online
            </a>
          </p>
        </div>
      </div>
    </div>
  `
  })

  // Check for errors first
  if (error) {
    await createLog('error', `Failed to send ticket confirmation email: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      userId,
      ticketId: ticket.id
    })
    throw new Error(`Resend API error: ${error.message || 'Unknown error'}`)
  }

  // Check if data is null (which indicates failure)
  if (!data) {
    await createLog('error', `RESEND RETURNED NULL DATA for ticket confirmation`, {
      errorLocation: parseStack(JSON.stringify(error)),
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      userId,
      ticketId: ticket.id
    })
    throw new Error('Resend returned null data - ticket confirmation email send failed')
  }

  await createLog('info', 'Ticket confirmation email sent successfully', {
    location: ['api route - POST /api/support/create-ticket'],
    name: 'TicketConfirmationSent',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    message: `Sent confirmation for ticket #${ticket.id.slice(-8)} to ${ticket.email}`,
    userId,
    ticketId: ticket.id
  })
  return data
}

// Helper function to get priority colors for email
const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'low':
      return '#22c55e' // green
    case 'medium':
      return '#f59e0b' // yellow
    case 'high':
      return '#f97316' // orange
    case 'urgent':
      return '#ef4444' // red
    default:
      return '#6b7280' // gray
  }
}

export default sendTicketConfirmation
