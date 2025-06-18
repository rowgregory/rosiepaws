import { Resend } from 'resend'
import { createLog } from './utils/logHelper'
import { NextRequest } from 'next/server'
import { parseStack } from 'error-stack-parser-es/lite'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendMedicationReminder = async (medication: any, currentTime: string, req: NextRequest, ownerId: string) => {
  const { data, error } = await resend.emails.send({
    from: `${process.env.RESEND_FROM_EMAIL}`,
    to: [medication.pet.owner.email],
    subject: `🐾 Medication Reminder: ${medication.drugName} for ${medication.pet.name}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🐾 Medication Reminder</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Time for ${medication.pet.name}'s medication!</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #495057; margin-top: 0; font-size: 20px;">Medication Details</h2>
          
          <div style="margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Pet:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${medication.pet.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Medication:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${medication.drugName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Dosage:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${medication.dosage} ${medication.dosageUnit}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Time:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${currentTime}</td>
              </tr>
              ${
                medication.instructions
                  ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Instructions:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${medication.instructions}</td>
              </tr>
              `
                  : ''
              }
              ${
                medication.prescribedBy
                  ? `
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #495057;">Prescribed by:</td>
                <td style="padding: 10px 0; color: #6c757d;">${medication.prescribedBy}</td>
              </tr>
              `
                  : ''
              }
            </table>
          </div>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; border-left: 4px solid #0066cc; margin-top: 20px;">
            <p style="margin: 0; color: #0066cc; font-size: 14px;">
              <strong>💡 Tip:</strong> Make sure to give the medication with food if recommended by your veterinarian.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>This is an automated reminder from your Pet Medication System</p>
          <p>Sent on ${new Date().toLocaleDateString()} at ${currentTime}</p>
        </div>
      </div>
    </div>
  `
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

export default sendMedicationReminder
