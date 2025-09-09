import { createLog } from '@/app/lib/api/createLog'
import sendPaymentFailedEmail from '@/app/lib/resend/sendPaymentFailedEmail'
import { createStripeInstance } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string
  const attemptCount = invoice.attempt_count || 1

  if (!subscriptionId) {
    console.log('Payment failed for non-subscription invoice:', invoice.id)
    return
  }

  const stripe = createStripeInstance()

  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Find the subscription record
    const stripeSubscription = await prisma.stripeSubscription.findFirst({
      where: { customerId: customerId },
      include: {
        user: {
          select: { email: true, id: true, firstName: true }
        }
      }
    })

    if (!stripeSubscription) {
      await createLog('error', 'Payment failed but no subscription record found', {
        location: ['webhook - invoice.payment_failed'],
        name: 'PaymentFailedNoSubscription',
        timestamp: new Date().toISOString(),
        customerId: customerId,
        subscriptionId: subscriptionId,
        invoiceId: invoice.id,
        attemptCount: attemptCount
      })
      return
    }

    const currentPeriodEnd = (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Update subscription status
    await prisma.stripeSubscription.update({
      where: { id: stripeSubscription.id },
      data: {
        status: subscription.status, // 'past_due', 'unpaid', etc.
        currentPeriodEnd
      }
    })

    // Log the payment failure
    await createLog('error', 'Subscription payment failed', {
      location: ['webhook - invoice.payment_failed'],
      name: 'SubscriptionPaymentFailed',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      invoiceId: invoice.id,
      attemptCount: attemptCount,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
      subscriptionStatus: subscription.status,
      userId: stripeSubscription.userId,
      userEmail: stripeSubscription.user.email,
      nextPaymentAttempt: invoice.next_payment_attempt
        ? new Date(invoice.next_payment_attempt * 1000).toISOString()
        : null,
      plan: stripeSubscription.plan,
      planPrice: stripeSubscription.planPrice
    })

    // Determine email strategy based on attempt count
    const shouldSendEmail = attemptCount <= 3 // Only send for first 3 attempts
    const isLastAttempt = attemptCount >= 3

    if (shouldSendEmail) {
      try {
        // Send payment failed notification
        await sendPaymentFailedEmail({
          customerEmail: stripeSubscription.user.email,
          customerName: stripeSubscription.user.firstName || 'Valued Customer',
          planName: stripeSubscription.plan,
          planPrice: stripeSubscription.planPrice / 100, // Convert cents to dollars
          attemptCount: attemptCount,
          amountDue: invoice.amount_due / 100,
          invoiceUrl: invoice.hosted_invoice_url || '',
          nextAttemptDate: invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString()
            : null,
          isLastAttempt: isLastAttempt,
          customMessage: isLastAttempt
            ? 'This is our final attempt to process your payment. Please update your payment method to avoid service interruption.'
            : "We'll automatically retry your payment. You can also update your payment method in your account."
        })

        await createLog('info', 'Payment failed email sent', {
          location: ['webhook - invoice.payment_failed'],
          name: 'PaymentFailedEmailSent',
          timestamp: new Date().toISOString(),
          customerId: customerId,
          subscriptionId: subscriptionId,
          userEmail: stripeSubscription.user.email,
          attemptCount: attemptCount,
          isLastAttempt: isLastAttempt
        })
      } catch (emailError) {
        await createLog('error', 'Failed to send payment failed email', {
          location: ['webhook - invoice.payment_failed'],
          name: 'PaymentFailedEmailError',
          timestamp: new Date().toISOString(),
          customerId: customerId,
          subscriptionId: subscriptionId,
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          attemptCount: attemptCount
        })
      }
    }

    // Handle subscription cancellation if final attempt failed
    if (subscription.status === 'unpaid' || (isLastAttempt && subscription.status === 'past_due')) {
      await createLog('warning', 'Subscription may be cancelled due to payment failure', {
        location: ['webhook - invoice.payment_failed'],
        name: 'SubscriptionCancellationRisk',
        timestamp: new Date().toISOString(),
        customerId: customerId,
        subscriptionId: subscriptionId,
        userId: stripeSubscription.userId,
        subscriptionStatus: subscription.status,
        finalAttempt: isLastAttempt
      })

      // Optionally downgrade to free plan or take other action
      if (subscription.status === 'unpaid') {
        await prisma.stripeSubscription.update({
          where: { id: stripeSubscription.id },
          data: {
            plan: 'FREE',
            planPrice: 0,
            status: 'canceled'
          }
        })

        await createLog('info', 'Subscription downgraded to free due to payment failure', {
          location: ['webhook - invoice.payment_failed'],
          name: 'SubscriptionDowngradedToFree',
          timestamp: new Date().toISOString(),
          customerId: customerId,
          subscriptionId: subscriptionId,
          userId: stripeSubscription.userId
        })
      }
    }
  } catch (error) {
    await createLog('error', 'Error handling payment failure', {
      location: ['webhook - invoice.payment_failed'],
      name: 'PaymentFailedHandlerError',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })

    // Re-throw so webhook returns 500 and Stripe retries
    throw error
  }
}

export default handleInvoicePaymentFailed
