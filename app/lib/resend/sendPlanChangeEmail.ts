import { Resend } from 'resend'
import { parseStack } from 'error-stack-parser-es/lite'
import { createLog } from '../api/createLog'
import planChangeSuccessTemplate from '../email-templates/plan-change-template'

const resend = new Resend(process.env.RESEND_API_KEY)

interface PlanChangeEmailData {
  customerEmail: string
  previousPlan: string
  newPlan: string
  planPrice: number
  transactionId: string
  nextBillingDate: string
  changeType: 'upgrade' | 'downgrade'
  customMessage?: string
}

const sendPlanChangeEmail = async (emailData: PlanChangeEmailData) => {
  // Validate required fields
  if (!emailData.customerEmail) {
    throw new Error('Customer email is required')
  }

  if (!emailData.transactionId) {
    throw new Error('Transaction ID is required')
  }

  // Generate dynamic subject line
  const isUpgrade = emailData.changeType === 'upgrade'
  const subject = isUpgrade
    ? `🎉 Welcome to ${emailData.newPlan}! Your upgrade is complete`
    : `✅ Plan updated to ${emailData.newPlan}`

  try {
    const { data, error } = await resend.emails.send({
      from: `Rosie Paws <${process.env.RESEND_FROM_EMAIL}>`,
      to: [emailData.customerEmail],
      subject: subject,
      html: planChangeSuccessTemplate(
        emailData.customerEmail,
        emailData.previousPlan,
        emailData.newPlan,
        emailData.planPrice,
        emailData.transactionId,
        emailData.nextBillingDate,
        emailData.changeType,
        emailData.customMessage
      )
    })

    // Check for errors first
    if (error) {
      await createLog('error', `Failed to send plan change email: ${error.message}`, {
        errorLocation: parseStack(JSON.stringify(error)),
        errorMessage: error.message,
        errorName: error.name || 'ResendAPIError',
        timestamp: new Date().toISOString(),
        customerEmail: emailData.customerEmail,
        transactionId: emailData.transactionId,
        planChange: `${emailData.previousPlan} → ${emailData.newPlan}`,
        changeType: emailData.changeType
      })
      throw new Error(`Resend API error: ${error.message || 'Unknown error'}`)
    }

    // Check if data is null (which indicates failure)
    if (!data) {
      await createLog('error', 'RESEND RETURNED NULL DATA for plan change email', {
        errorLocation: parseStack('Resend returned null data'),
        timestamp: new Date().toISOString(),
        customerEmail: emailData.customerEmail,
        transactionId: emailData.transactionId,
        planChange: `${emailData.previousPlan} → ${emailData.newPlan}`
      })
      throw new Error('Resend returned null data - plan change email send failed')
    }

    // Log successful email send
    await createLog('info', 'Plan change email sent successfully', {
      location: ['webhook - invoice.payment_succeeded'],
      name: 'PlanChangeEmailSent',
      timestamp: new Date().toISOString(),
      message: `Sent ${emailData.changeType} confirmation for transaction ${emailData.transactionId.slice(-8)} to ${emailData.customerEmail}`,
      customerEmail: emailData.customerEmail,
      transactionId: emailData.transactionId,
      planChange: `${emailData.previousPlan} → ${emailData.newPlan}`,
      changeType: emailData.changeType,
      emailId: data.id,
      planPrice: emailData.planPrice
    })

    return data
  } catch (emailError) {
    // Handle any unexpected errors
    const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error'

    await createLog('error', 'Unexpected error sending plan change email', {
      errorLocation: parseStack(emailError instanceof Error ? emailError.stack || '' : ''),
      errorMessage: errorMessage,
      errorName: emailError instanceof Error ? emailError.name : 'UnknownError',
      timestamp: new Date().toISOString(),
      customerEmail: emailData.customerEmail,
      transactionId: emailData.transactionId,
      planChange: `${emailData.previousPlan} → ${emailData.newPlan}`
    })

    // Re-throw the error so the calling function knows it failed
    throw new Error(`Failed to send plan change email: ${errorMessage}`)
  }
}

export default sendPlanChangeEmail
