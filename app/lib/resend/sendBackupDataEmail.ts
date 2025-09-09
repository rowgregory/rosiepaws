import { Resend } from 'resend'
import { createLog } from '../api/createLog'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendBackupDataEmail = async (
  backupData: any,
  adminEmails: string | string[], // Accept both string and array
  req: NextRequest,
  ownerId: string | undefined
) => {
  // Convert to array if single email
  const emailArray = Array.isArray(adminEmails) ? adminEmails : [adminEmails]

  const { data, error } = await resend.emails.send({
    from: `${process.env.RESEND_FROM_EMAIL}`,
    to: emailArray, // Resend accepts array of emails
    subject: `Scheduled Backup - ${new Date().toLocaleDateString()}`,
    html: `<p>Your scheduled backup is attached.</p>`,
    attachments: [
      {
        filename: `backup-${new Date().toISOString().split('T')[0]}.json`,
        content: Buffer.from(JSON.stringify(backupData, null, 2), 'utf8')
      }
    ]
  })

  if (error) {
    await createLog('error', `Failed to send backup data email: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      ownerId,
      emailRecipients: emailArray
    })
    throw new Error(`Resend API error: ${error.message || 'Unknown error'}`)
  }

  if (!data) {
    await createLog('error', `RESEND RETURNED NULL DATA`, {
      errorLocation: parseStack(JSON.stringify(error)),
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      ownerId,
      emailRecipients: emailArray
    })
    throw new Error('Resend returned null data - email send failed')
  }

  await createLog('info', 'Backup data sent successfully', {
    location: ['api route - POST /api/cron/create-backup'],
    name: 'ResendSuccess',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    message: `Sent backup data to ${emailArray.join(', ')}`,
    emailRecipients: emailArray,
    ownerId
  })

  return data
}
