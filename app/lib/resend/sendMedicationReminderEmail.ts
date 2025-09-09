import { Resend } from 'resend'
import { NextRequest } from 'next/server'
import { parseStack } from 'error-stack-parser-es/lite'
import { createLog } from '../api/createLog'
import medicationReminderTemplate from '../email-templates/medication-reminder-template'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendMedicationReminderEmail = async (medication: any, currentTime: string, req: NextRequest, ownerId: string) => {
  const { data, error } = await resend.emails.send({
    from: `${process.env.RESEND_FROM_EMAIL}`,
    to: [medication.pet.owner.email],
    subject: `🐾 Medication Reminder: ${medication.drugName} for ${medication.pet.name}`,
    html: medicationReminderTemplate(medication, currentTime)
  })

  // Check for errors first
  if (error) {
    await createLog('error', `Fail to send medication reminder email: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      ownerId
    })
    throw new Error(`Resend API error: ${error.message || 'Unknown error'}`)
  }

  // Check if data is null (which indicates failure)
  if (!data) {
    await createLog('error', `RESEND RETURNED NULL DATA`, {
      errorLocation: parseStack(JSON.stringify(error)),
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      ownerId
    })
    throw new Error('Resend returned null data - email send failed')
  }

  await createLog('info', 'Medication reminder sent successfully', {
    location: ['api route - POST /api/pet/check-med-reminders'],
    name: 'ResendSuccess',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    message: `Sent reminder for ${medication.drugName} to ${medication.pet.name}`,
    ownerId
  })
  return data
}

export default sendMedicationReminderEmail
