import { Resend } from 'resend'
import { parseStack } from 'error-stack-parser-es/lite'
import { createLog } from '../api/createLog'
import { PaymentFailedEmailData } from '@/app/types/resend'
import paymentFailedTemplate from '../email-templates/payment-failed-template'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendPaymentFailedEmail = async (data: PaymentFailedEmailData) => {
  // Validate required fields
  if (!data.customerEmail) {
    throw new Error('Customer email is required')
  }

  if (!data.invoiceUrl) {
    throw new Error('Invoice URL is required')
  }

  // Generate dynamic subject line
  const subject = data.isLastAttempt
    ? `🚨 URGENT: Final payment attempt for ${data.planName} - Action Required`
    : `⚠️ Payment issue with your ${data.planName} subscription (Attempt ${data.attemptCount}/3)`

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `Rosie Paws <${process.env.RESEND_FROM_EMAIL}>`,
      to: [data.customerEmail],
      subject: subject,
      html: paymentFailedTemplate(data)
    })

    // Check for errors first
    if (error) {
      await createLog('error', `Failed to send payment failed email: ${error.message}`, {
        errorLocation: parseStack(JSON.stringify(error)),
        errorMessage: error.message,
        errorName: error.name || 'ResendAPIError',
        timestamp: new Date().toISOString(),
        customerEmail: data.customerEmail,
        attemptCount: data.attemptCount,
        amountDue: data.amountDue,
        planName: data.planName,
        isLastAttempt: data.isLastAttempt
      })
      throw new Error(`Resend API error: ${error.message || 'Unknown error'}`)
    }

    // Check if data is null (which indicates failure)
    if (!emailData) {
      await createLog('error', 'RESEND RETURNED NULL DATA for payment failed email', {
        errorLocation: parseStack('Resend returned null data'),
        timestamp: new Date().toISOString(),
        customerEmail: data.customerEmail,
        attemptCount: data.attemptCount,
        amountDue: data.amountDue
      })
      throw new Error('Resend returned null data - payment failed email send failed')
    }

    // Log successful email send
    await createLog('info', 'Payment failed email sent successfully', {
      location: ['webhook - invoice.payment_failed'],
      name: 'PaymentFailedEmailSent',
      timestamp: new Date().toISOString(),
      message: `Sent payment failure notification (attempt ${data.attemptCount}/3) to ${data.customerEmail}`,
      customerEmail: data.customerEmail,
      attemptCount: data.attemptCount,
      amountDue: data.amountDue,
      planName: data.planName,
      isLastAttempt: data.isLastAttempt,
      emailId: emailData.id
    })

    return emailData
  } catch (emailError) {
    // Handle any unexpected errors
    const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error'

    await createLog('error', 'Unexpected error sending payment failed email', {
      errorLocation: parseStack(emailError instanceof Error ? emailError.stack || '' : ''),
      errorMessage: errorMessage,
      errorName: emailError instanceof Error ? emailError.name : 'UnknownError',
      timestamp: new Date().toISOString(),
      customerEmail: data.customerEmail,
      attemptCount: data.attemptCount,
      amountDue: data.amountDue
    })

    // Re-throw the error so the calling function knows it failed
    throw new Error(`Failed to send payment failed email: ${errorMessage}`)
  }
}

export default sendPaymentFailedEmail
