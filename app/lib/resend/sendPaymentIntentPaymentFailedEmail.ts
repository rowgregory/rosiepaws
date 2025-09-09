import { Resend } from 'resend'
import { parseStack } from 'error-stack-parser-es/lite'
import { createLog } from '../api/createLog'
import paymentIntentPaymentFailedTemplate from '../email-templates/payment-intent-payment-failed-template'
import { PaymentIntentFailedEmailData } from '@/app/types/resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendPaymentIntentPaymentFailedEmail = async (data: PaymentIntentFailedEmailData) => {
  // Validate required fields
  if (!data.customerEmail) {
    throw new Error('Customer email is required')
  }

  // Generate dynamic subject line based on failure type
  let subject = ''
  switch (data.failureType) {
    case 'plan_change':
      subject = `❌ Upgrade to ${data.targetPlan} failed - Please try again`
      break
    case 'initial_subscription':
      subject = `❌ Subscription payment failed - Action required`
      break
    default:
      subject = `❌ Payment issue with your ${data.targetPlan} plan`
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `Rosie Paws <${process.env.RESEND_FROM_EMAIL}>`,
      to: [data.customerEmail],
      subject: subject,
      html: paymentIntentPaymentFailedTemplate(data)
    })

    // Check for errors first
    if (error) {
      await createLog('error', `Failed to send payment intent failed email: ${error.message}`, {
        errorLocation: parseStack(JSON.stringify(error)),
        errorMessage: error.message,
        errorName: error.name || 'ResendAPIError',
        timestamp: new Date().toISOString(),
        customerEmail: data.customerEmail,
        failureType: data.failureType,
        amountFailed: data.amountFailed,
        targetPlan: data.targetPlan
      })
      throw new Error(`Resend API error: ${error.message || 'Unknown error'}`)
    }

    // Check if data is null (which indicates failure)
    if (!emailData) {
      await createLog('error', 'RESEND RETURNED NULL DATA for payment intent failed email', {
        errorLocation: parseStack('Resend returned null data'),
        timestamp: new Date().toISOString(),
        customerEmail: data.customerEmail,
        failureType: data.failureType,
        amountFailed: data.amountFailed
      })
      throw new Error('Resend returned null data - payment intent failed email send failed')
    }

    // Log successful email send
    await createLog('info', 'Payment intent failed email sent successfully', {
      location: ['webhook - payment_intent.payment_failed'],
      name: 'PaymentIntentFailedEmailSent',
      timestamp: new Date().toISOString(),
      message: `Sent ${data.failureType} failure notification to ${data.customerEmail}`,
      customerEmail: data.customerEmail,
      failureType: data.failureType,
      amountFailed: data.amountFailed,
      targetPlan: data.targetPlan,
      currentPlan: data.currentPlan,
      emailId: emailData.id
    })

    return emailData
  } catch (emailError) {
    // Handle any unexpected errors
    const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error'

    await createLog('error', 'Unexpected error sending payment intent failed email', {
      errorLocation: parseStack(emailError instanceof Error ? emailError.stack || '' : ''),
      errorMessage: errorMessage,
      errorName: emailError instanceof Error ? emailError.name : 'UnknownError',
      timestamp: new Date().toISOString(),
      customerEmail: data.customerEmail,
      failureType: data.failureType,
      amountFailed: data.amountFailed
    })

    // Re-throw the error so the calling function knows it failed
    throw new Error(`Failed to send payment intent failed email: ${errorMessage}`)
  }
}

export default sendPaymentIntentPaymentFailedEmail
